import { useUser } from '@context/User';
import styles from './Dashboard.module.css';
import { useData } from '@context/Data';
import { CustomAxiosError, VendorUpcomingOrder } from 'types';
import {
  axiosInstance,
  dateToMS,
  dateToText,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import ModalContainer from '@components/layout/ModalContainer';
import StatusUpdateModal from './StatusUpdateModal';

type RestaurantSchedule = {
  _id: string;
  date: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type Restaurant = {
  _id: string;
  schedules: RestaurantSchedule[];
};

type OrderMap = {
  [key: string]: {
    orders: VendorUpcomingOrder[];
    quantity: number;
  };
};

type OrderGroupSchedule = {
  _id: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type OrderGroup = {
  date: string;
  quantity: number;
  orders: VendorUpcomingOrder[];
  schedule: OrderGroupSchedule;
};

export default function Dashboard() {
  const { setAlerts } = useAlert();
  const { vendor } = useUser();
  const { vendorUpcomingOrders } = useData();
  const [orderGroups, setOrderGroups] = useState<OrderGroup[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    date: '',
    schedule: {
      _id: '',
      status: '',
    },
  });
  const [isUpdatingScheduleStatus, setIsUpdatingScheduleStatus] =
    useState(false);

  function initiateScheduleUpdate(date: string, schedule: OrderGroupSchedule) {
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      date,
      schedule,
    });
  }

  async function updateStatus() {
    if (!restaurant) return;
    try {
      setIsUpdatingScheduleStatus(true);
      const response = await axiosInstance.patch(
        `/restaurants/${restaurant._id}/${statusUpdatePayload.schedule._id}/change-schedule-status`,
        {
          action:
            statusUpdatePayload.schedule.status === 'ACTIVE'
              ? 'Deactivate'
              : 'Activate',
        }
      );
      const schedule = response.data.find(
        (schedule: { scheduleId: string }) =>
          schedule.scheduleId === statusUpdatePayload.schedule._id
      );
      setRestaurant(
        (prevState) =>
          prevState && {
            ...prevState,
            schedules: prevState.schedules.map((prevSchedule) =>
              prevSchedule._id === schedule.scheduleId
                ? { ...prevSchedule, status: schedule.status }
                : prevSchedule
            ),
          }
      );
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingScheduleStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  // Get the restaurant
  useEffect(() => {
    async function getRestaurant() {
      if (!vendor) return;
      try {
        const response = await axiosInstance.get(
          `/restaurants/${vendor.restaurant}`
        );
        setRestaurant(response.data);
      } catch (err) {
        console.log(err);
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (vendor) getRestaurant();
  }, [vendor]);

  // Create order groups
  useEffect(() => {
    if (restaurant) {
      const orderMap: OrderMap = {};
      for (const order of vendorUpcomingOrders.data) {
        const deliveryDate = dateToMS(order.delivery.date);
        if (!orderMap[deliveryDate]) {
          orderMap[deliveryDate] = { orders: [], quantity: 0 };
        }
        orderMap[deliveryDate].orders.push(order);
        orderMap[deliveryDate].quantity += order.item.quantity;
      }

      const orderGroups: OrderGroup[] = [];
      for (const deliveryDate in orderMap) {
        const schedule = restaurant.schedules.find(
          (schedule) => dateToMS(schedule.date) === +deliveryDate
        );
        if (schedule) {
          orderGroups.push({
            date: deliveryDate,
            orders: orderMap[deliveryDate].orders,
            quantity: orderMap[deliveryDate].quantity,
            schedule: {
              _id: schedule._id,
              status: schedule.status,
            },
          });
        }
      }
      setOrderGroups(orderGroups);
    }
  }, [restaurant, vendorUpcomingOrders]);

  return (
    <section className={styles.container}>
      {vendor && (
        <div className={styles.header}>
          <h1>Welcome {vendor.firstName}</h1>
          <p>
            This is just a preview of the order. You will receive an email with
            the total order from Spork Bytes soon.
          </p>
        </div>
      )}

      {orderGroups.length ? (
        <>
          {orderGroups.map(({ date, orders, quantity, schedule }) => (
            <div className={styles.group} key={date}>
              <div className={styles.group_header}>
                <h2>{dateToText(+date)}</h2>
                <button
                  onClick={() =>
                    initiateScheduleUpdate(dateToText(+date), schedule)
                  }
                >
                  {schedule.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Removed</th>
                    <th>Addons</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.item.name}</td>
                      <td>{order.item.quantity}</td>
                      <td>{order.item.removedIngredients}</td>
                      <td>
                        {order.item.optionalAddons}
                        {order.item.requiredAddons}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>Total quantity</td>
                    <td>{quantity}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </>
      ) : (
        <p>No upcoming orders</p>
      )}

      <ModalContainer
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
        component={
          <StatusUpdateModal
            updateStatus={updateStatus}
            date={statusUpdatePayload.date}
            setShowModal={setShowStatusUpdateModal}
            isUpdating={isUpdatingScheduleStatus}
            action={
              statusUpdatePayload.schedule.status === 'ACTIVE'
                ? 'Deactivate'
                : 'Activate'
            }
          />
        }
      />
    </section>
  );
}
