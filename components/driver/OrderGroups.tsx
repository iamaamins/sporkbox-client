import styles from './OrderGroups.module.css';
import { useData } from '@context/Data';
import Link from 'next/link';
import { createOrderGroups, dateToMS, dateToText } from '@lib/utils';

export default function OrderGroups() {
  const { driverOrders } = useData();
  const orderGroups = createOrderGroups(driverOrders.data);

  return (
    <section className={styles.container}>
      <h2>
        {driverOrders.isLoading
          ? 'Loading...'
          : !driverOrders.isLoading && driverOrders.data.length === 0
          ? 'No orders found'
          : 'Orders'}
      </h2>
      {orderGroups.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Delivery date</th>
                <th className={styles.hide_on_mobile}>Company code</th>
                <th className={styles.hide_on_mobile}>Restaurant</th>
                <th>Headcount</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {orderGroups.map((orderGroup, index) => (
                <tr key={index} className={styles.container}>
                  <td className={styles.important}>
                    <Link
                      href={`/driver/orders/${
                        orderGroup.company.code
                      }/${dateToMS(orderGroup.deliveryDate)}`}
                    >
                      <a>{dateToText(orderGroup.deliveryDate)} </a>
                    </Link>
                  </td>
                  <td className={styles.hide_on_mobile}>
                    {orderGroup.company.code}
                  </td>
                  <td
                    className={`${styles.restaurants} ${styles.hide_on_mobile}`}
                  >
                    {orderGroup.restaurants.map((restaurant) => (
                      <span key={restaurant}>{restaurant}</span>
                    ))}
                  </td>
                  <td>{orderGroup.customers.length}</td>
                  <td>{orderGroup.orders.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
