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
  getAddonIngredients,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import ModalContainer from '@components/layout/ModalContainer';
import StatusUpdateModal from './StatusUpdateModal';
import { FiDownload } from 'react-icons/fi';
import { pdf } from '@react-pdf/renderer';
import Labels from '@components/admin/layout/Labels';

type OrderMap = {
  [key: string]: {
    orders: VendorUpcomingOrder[];
    totalQuantity: number;
  };
};

type OrderGroupSchedule = {
  date: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type OrderGroup = {
  date: string;
  company: string;
  totalQuantity: number;
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

  async function generateAndDownloadLabels(
    date: string,
    orders: VendorUpcomingOrder[]
  ) {
    const labels = [];
    for (const order of orders) {
      for (let i = 0; i < order.item.quantity; i++) {
        labels.push({
          customer: {
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            shift: order.company.shift,
          },
          restaurant: order.restaurant.name,
          item: {
            name: order.item.name,
            optional: getAddonIngredients(order.item.optionalAddons),
            required: getAddonIngredients(order.item.requiredAddons),
            removed: getAddonIngredients(order.item.removedIngredients),
          },
        });
      }
    }
    labels.sort((a, b) => {
      const restaurantComp = a.restaurant.localeCompare(b.restaurant);
      if (restaurantComp) return restaurantComp;
      const itemComp = a.item.name.localeCompare(b.item.name);
      if (itemComp) return itemComp;
      return a.customer.lastName.localeCompare(b.customer.lastName);
    });

    const blob = await pdf(<Labels labels={labels} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Labels - ${dateToText(+date)}.pdf`;
    a.click();
  }

  type IdenticalItemGroup = {
    item: {
      name: string;
      requiredAddons?: string;
      optionalAddons?: string;
      removedIngredients?: string;
    };
    quantity: number;
  };
  function groupIdenticalItems(orders: VendorUpcomingOrder[]) {
    const orderMap: Record<string, IdenticalItemGroup> = {};
    for (const order of orders) {
      const key =
        order.item._id +
        order.item.requiredAddons +
        order.item.optionalAddons +
        order.item.removedIngredients;

      if (!orderMap[key]) {
        orderMap[key] = {
          item: {
            name: order.item.name,
            requiredAddons: order.item.requiredAddons,
            optionalAddons: order.item.optionalAddons,
            removedIngredients: order.item.removedIngredients,
          },
          quantity: order.item.quantity,
        };
      } else {
        orderMap[key].quantity += order.item.quantity;
      }
    }
    return Object.values(orderMap);
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

        if (!orderMap[dateAndCompany]) {
          orderMap[dateAndCompany] = {
            orders: [order],
            totalQuantity: order.item.quantity,
          };
        } else {
          orderMap[dateAndCompany].orders.push(order);
          orderMap[dateAndCompany].totalQuantity += order.item.quantity;
        }
      }

      const orderGroups: OrderGroup[] = [];
      for (const key in orderMap) {
        const schedules: OrderGroupSchedule[] = [];
        for (const schedule of restaurant.data.schedules) {
          const company = schedule.company.code;
          const date = dateToMS(schedule.date);
          const dateAndCompany = `${date}-${company}`;

          if (key === dateAndCompany) {
            schedules.push({ date: schedule.date, status: schedule.status });
          }
        }

        if (schedules.length) {
          orderGroups.push({
            schedules,
            date: key.split('-')[0],
            company: key.split('-')[1],
            totalQuantity: orderMap[key].totalQuantity,
            orders: orderMap[key].orders,
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
      ) : orderGroups.length > 0 ? (
        <>
          {orderGroups.map(
            ({ date, company, orders, totalQuantity, schedules }) => (
              <div className={styles.group} key={date}>
                <div className={styles.group_header}>
                  <h2>{dateToText(+date)}</h2>
                  <button
                    onClick={(e) => initiateScheduleUpdate(e, date, company)}
                  >
                    {schedules[0].status === 'ACTIVE'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                  <button
                    onClick={() => generateAndDownloadLabels(date, orders)}
                  >
                    Labels <FiDownload />
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Addons</th>
                      <th>Removed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupIdenticalItems(orders).map((group, index) => (
                      <tr key={index}>
                        <td>{group.item.name}</td>
                        <td>{group.quantity}</td>
                        <td>
                          {group.item.optionalAddons}{' '}
                          {group.item.requiredAddons}
                        </td>
                        <td>{group.item.removedIngredients}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total</td>
                      <td>{totalQuantity}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          )}
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
