import Orders from './Orders';
import { useState } from 'react';
import { CustomAxiosError } from 'types';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import styles from './Dashboard.module.css';
import ActionButton from '@components/layout/ActionButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';

export default function Dashboard() {
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const {
    customerUpcomingOrders,
    customerDeliveredOrders,
    setCustomerDeliveredOrders,
  } = useData();

  async function handleLoadAllDeliveredOrders() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/orders/me/delivered-orders/0`);
      setCustomerDeliveredOrders((prevState) => ({
        ...prevState,
        data: response.data,
      }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className={styles.container}>
        <h2>
          {customerUpcomingOrders.isLoading
            ? 'Loading...'
            : !customerUpcomingOrders.isLoading &&
              customerUpcomingOrders.data.length === 0
            ? 'No active orders'
            : 'Active orders'}
        </h2>
        {customerUpcomingOrders.data.length > 0 && (
          <Orders orders={customerUpcomingOrders.data} />
        )}
      </section>

      <section className={styles.container}>
        <h2>
          {customerDeliveredOrders.isLoading
            ? 'Loading...'
            : !customerUpcomingOrders.isLoading &&
              customerUpcomingOrders.data.length === 0
            ? 'No delivered orders'
            : 'Delivered orders'}
        </h2>
        {customerDeliveredOrders.data.length > 0 && (
          <>
            <Orders orders={customerDeliveredOrders.data} />
            {customerDeliveredOrders.data.length === 10 && (
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
    </>
  );
}
