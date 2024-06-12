import { useUser } from '@context/User';
import styles from './Dashboard.module.css';
import { useData } from '@context/Data';
import {
  CustomAxiosError,
  Restaurant,
  Schedule,
  VendorUpcomingOrderItem,
} from 'types';
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

type OrderGroupSchedule = {
  _id: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type OrderGroup = {
  date: number;
  shift: 'day' | 'night';
  quantity: number;
  schedule: OrderGroupSchedule;
  items: VendorUpcomingOrderItem[];
};

type VendorRestaurant = {
  isLoading: boolean;
  data: Omit<Restaurant, 'items' | 'createdAt'> | null;
};

export default function Dashboard() {
  const { setAlerts } = useAlert();
  const { vendor } = useUser();
  const { vendorUpcomingOrders } = useData();
  const [orderGroups, setOrderGroups] = useState<OrderGroup[]>([]);
  const [restaurant, setRestaurant] = useState<VendorRestaurant>({
    isLoading: true,
    data: null,
  });
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
    if (!restaurant.data) return;
    try {
      setIsUpdatingScheduleStatus(true);
      const response = await axiosInstance.patch(
        `/restaurants/${restaurant.data._id}/${statusUpdatePayload.schedule._id}/change-schedule-status`,
        {
          action:
            statusUpdatePayload.schedule.status === 'ACTIVE'
              ? 'Deactivate'
              : 'Activate',
        }
      );
      const schedule = response.data.find(
        (schedule: Schedule) =>
          schedule._id === statusUpdatePayload.schedule._id
      );
      setRestaurant((prevState) => ({
        ...prevState,
        data: prevState.data
          ? {
              ...prevState.data,
              schedules: prevState.data?.schedules.map((prevSchedule) =>
                prevSchedule._id === schedule._id
                  ? { ...prevSchedule, status: schedule.status }
                  : prevSchedule
              ),
            }
          : null,
      }));
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingScheduleStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  function combineAddons(optional: string, required: string) {
    let combined = '';
    if (optional) combined = optional;
    if (required) combined = required;
    if (optional && required) combined = `${optional}, ${required}`;
    return combined;
  }

  // Get the restaurant
  useEffect(() => {
    async function getRestaurant() {
      if (!vendor) return;
      try {
        const response = await axiosInstance.get(
          `/restaurants/${vendor.restaurant}`
        );
        setRestaurant({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setRestaurant((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (vendor) getRestaurant();
  }, [vendor]);

  // Create order groups
  useEffect(() => {
    if (restaurant.data && vendorUpcomingOrders.data.length) {
      const orderMap: Record<string, OrderGroup> = {};
      for (const order of vendorUpcomingOrders.data) {
        const shift = order.company.shift;
        const date = dateToMS(order.delivery.date);
        const schedule = restaurant.data.schedules.find(
          (schedule) =>
            dateToMS(schedule.date) === date && schedule.company.shift === shift
        );

        if (schedule) {
          const dateShift = `${date}-${shift}`;
          if (!orderMap[dateShift]) {
            orderMap[dateShift] = {
              date,
              shift,
              items: [],
              quantity: 0,
              schedule: { _id: schedule._id, status: schedule.status },
            };
          }

          const existingItem = orderMap[dateShift].items.find(
            (item) =>
              item._id === order.item._id &&
              item.optionalAddons === order.item.optionalAddons &&
              item.requiredAddons === order.item.requiredAddons &&
              item.removedIngredients === order.item.removedIngredients
          );

          if (existingItem) {
            existingItem.quantity += order.item.quantity;
          } else {
            orderMap[dateShift].items.push({ ...order.item });
          }
          orderMap[dateShift].quantity += order.item.quantity;
        }
      }

      const orderGroups: OrderGroup[] = [];
      for (const dateShift in orderMap) {
        orderGroups.push(orderMap[dateShift]);
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

      {vendorUpcomingOrders.isLoading || restaurant.isLoading ? (
        <h2>Loading...</h2>
      ) : orderGroups.length ? (
        <>
          {orderGroups.map(({ date, shift, items, quantity, schedule }) => (
            <div className={styles.group} key={`${date}-${shift}`}>
              <div className={styles.group_header}>
                <h2>
                  {dateToText(+date)} - {shift}
                </h2>
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
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.removedIngredients}</td>
                      <td>
                        {combineAddons(
                          item.optionalAddons,
                          item.requiredAddons
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>Total</td>
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
