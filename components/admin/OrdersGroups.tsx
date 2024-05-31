import { FormEvent, useState } from 'react';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import OrderGroupRow from './OrderGroupRow';
import SortOrdersGroups from './SortOrderGroups';
import styles from './OrdersGroups.module.css';
import ActionButton from '@components/layout/ActionButton';
import { axiosInstance, dateToText, showErrorAlert } from '@lib/utils';
import { CustomAxiosError, OrderGroup, SortedOrderGroups } from 'types';
import ModalContainer from '@components/layout/ModalContainer';
import { pdf } from '@react-pdf/renderer';
import Labels from './Labels';
import SelectRestaurants from './SelectRestaurants';

type Props = {
  slug: string;
  title: string;
  orderGroups: OrderGroup[];
};

export default function OrdersGroups({ slug, title, orderGroups }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const { allUpcomingOrders, allDeliveredOrders, setAllDeliveredOrders } =
    useData();
  const [sorted, setSorted] = useState<SortedOrderGroups>({
    byCompany: false,
    byDeliveryDate: false,
  });

  async function handleLoadAllDeliveredOrders() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/orders/delivered/0`);
      setAllDeliveredOrders(response.data);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateAndDownloadLabels(
    e: FormEvent,
    selectedRestaurants: string[]
  ) {
    e.preventDefault();

    const orders = [];
    for (const orderGroup of orderGroups) {
      if (orderGroup.deliveryDate === deliveryDate) {
        orders.push(...orderGroup.orders);
      }
    }

    const labels = [];
    for (const order of orders) {
      if (selectedRestaurants.includes(order.restaurant.name)) {
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
              addons:
                order.item.optionalAddons || order.item.requiredAddons
                  ? `${order.item.optionalAddons} ${order.item.requiredAddons}`
                  : '',
              removed: order.item.removedIngredients || '',
            },
          });
        }
      }
    }
    labels.sort((a, b) => {
      const restaurantComp = a.restaurant.localeCompare(b.restaurant);
      if (restaurantComp !== 0) return restaurantComp;
      return a.item.name.localeCompare(b.item.name);
    });

    const blob = await pdf(<Labels labels={labels} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Labels - ${dateToText(deliveryDate)}.pdf`;
    a.click();
    setShowModal(false);
  }

  return (
    <>
      <section className={styles.orders_groups}>
        {slug === 'upcoming-orders' && allUpcomingOrders.isLoading && (
          <h2>Loading...</h2>
        )}
        {slug === 'delivered-orders' && allDeliveredOrders.isLoading && (
          <h2>Loading...</h2>
        )}
        {!allUpcomingOrders.isLoading &&
          !allDeliveredOrders.isLoading &&
          orderGroups.length === 0 && <h2>No {title.toLowerCase()}</h2>}

        {orderGroups.length > 0 && (
          <>
            <div className={styles.orders_top}>
              <h2>{title}</h2>
              <SortOrdersGroups
                setSorted={setSorted}
                orderGroups={orderGroups}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Delivery date</th>
                  <th className={styles.hide_on_mobile}>Company</th>
                  <th>Shift</th>
                  <th className={styles.hide_on_mobile}>Restaurant</th>
                  <th>Headcount</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderGroups.map((ordersGroup, index) => (
                  <OrderGroupRow
                    key={index}
                    slug={slug}
                    orderGroup={ordersGroup}
                    orderGroups={orderGroups}
                    setShowModal={setShowModal}
                    setRestaurants={setRestaurants}
                    setDeliveryDate={setDeliveryDate}
                  />
                ))}
              </tbody>
            </table>
            {router.pathname === '/admin/orders' &&
              orderGroups.length === 25 && (
                <span className={styles.load_all}>
                  <ActionButton
                    buttonText='Load all orders'
                    isLoading={isLoading}
                    handleClick={handleLoadAllDeliveredOrders}
                  />
                </span>
              )}
          </>
        )}
      </section>
      <ModalContainer
        showModalContainer={showModal}
        setShowModalContainer={setShowModal}
        component={
          <SelectRestaurants
            restaurants={restaurants}
            generateAndDownloadLabels={generateAndDownloadLabels}
          />
        }
      />
    </>
  );
}
