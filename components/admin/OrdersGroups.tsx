import { useState } from 'react';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import OrderGroupRow from './OrderGroupRow';
import SortOrdersGroups from './SortOrderGroups';
import styles from './OrdersGroups.module.css';
import ActionButton from '@components/layout/ActionButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import { CustomAxiosError, OrderGroup, SortedOrderGroups } from 'types';

type Props = {
  slug: string;
  title: string;
  orderGroups: OrderGroup[];
};

export default function OrdersGroups({ slug, title, orderGroups }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <section className={styles.orders_groups}>
      {/* Upcoming orders loader */}
      {slug === 'upcoming-orders' && allUpcomingOrders.isLoading && (
        <h2>Loading...</h2>
      )}

      {/* Delivered orders loader */}
      {slug === 'delivered-orders' && allDeliveredOrders.isLoading && (
        <h2>Loading...</h2>
      )}

      {/* If there are no orders groups */}
      {!allUpcomingOrders.isLoading &&
        !allDeliveredOrders.isLoading &&
        orderGroups.length === 0 && <h2>No {title.toLowerCase()}</h2>}

      {/* If there are active orders */}
      {orderGroups.length > 0 && (
        <>
          {/* Title and filter icon */}
          <div className={styles.orders_top}>
            <h2>{title}</h2>

            {/* Sort orders groups by company and delivery date */}
            <SortOrdersGroups setSorted={setSorted} orderGroups={orderGroups} />
          </div>

          {/* Orders groups */}
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
                />
              ))}
            </tbody>
          </table>

          {/* Load all orders button */}
          {router.pathname === '/admin/orders' && orderGroups.length === 25 && (
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
  );
}
