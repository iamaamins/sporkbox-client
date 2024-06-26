import { useUser } from '@context/User';
import styles from './Dashboard.module.css';
import { useData } from '@context/Data';
import { CustomAxiosError, Restaurant, VendorUpcomingOrder } from 'types';
import {
  axiosInstance,
  dateToMS,
  dateToText,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import ModalContainer from '@components/layout/ModalContainer';
import StatusUpdateModal from './StatusUpdateModal';

type OrderMap = {
  [key: string]: {
    orders: VendorUpcomingOrder[];
    quantity: number;
  };
};

type OrderGroupSchedule = {
  date: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type OrderGroup = {
  date: string;
  company: string;
  quantity: number;
  orders: VendorUpcomingOrder[];
  schedules: OrderGroupSchedule[];
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
    action: '',
    companyCode: '',
  });
  const [isUpdatingScheduleStatus, setIsUpdatingScheduleStatus] =
    useState(false);

  function initiateScheduleUpdate(
    e: FormEvent,
    date: string,
    companyCode: string
  ) {
    console.log(e.currentTarget.textContent);
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      date,
      companyCode,
      action: e.currentTarget.textContent!,
    });
  }

  async function updateStatus() {
    if (!restaurant.data) return;
    try {
      setIsUpdatingScheduleStatus(true);
      const response = await axiosInstance.patch(
        `/restaurants/${restaurant.data._id}/${statusUpdatePayload.date}/${statusUpdatePayload.companyCode}/change-schedule-status`,
        {
          action: statusUpdatePayload.action,
        }
      );

      setRestaurant((prevState) => ({
        ...prevState,
        data: prevState.data
          ? {
              ...prevState.data,
              schedules: response.data,
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
      const orderMap: OrderMap = {};
      for (const order of vendorUpcomingOrders.data) {
        const company = order.company.code;
        const date = dateToMS(order.delivery.date);
        const dateAndCompany = `${date}-${company}`;

        if (!orderMap[dateAndCompany])
          orderMap[dateAndCompany] = { orders: [], quantity: 0 };

        orderMap[dateAndCompany].orders.push(order);
        orderMap[dateAndCompany].quantity += order.item.quantity;
      }

      const orderGroups: OrderGroup[] = [];
      for (const key in orderMap) {
        const schedules: OrderGroupSchedule[] = [];
        for (const schedule of restaurant.data.schedules) {
          const company = schedule.company.code;
          const date = dateToMS(schedule.date);
          const dateAndCompany = `${date}-${company}`;

          if (key === dateAndCompany)
            schedules.push({ date: schedule.date, status: schedule.status });
        }

        if (schedules.length) {
          orderGroups.push({
            schedules,
            date: key.split('-')[0],
            company: key.split('-')[1],
            orders: orderMap[key].orders,
            quantity: orderMap[key].quantity,
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

      {vendorUpcomingOrders.isLoading || restaurant.isLoading ? (
        <h2>Loading...</h2>
      ) : orderGroups.length ? (
        <>
          {orderGroups.map(({ date, company, orders, quantity, schedules }) => (
            <div className={styles.group} key={date}>
              <div className={styles.group_header}>
                <h2>{dateToText(+date)}</h2>
                <button
                  onClick={(e) => initiateScheduleUpdate(e, date, company)}
                >
                  {schedules[0].status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
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
            action={statusUpdatePayload.action}
          />
        }
      />
    </section>
  );
}
