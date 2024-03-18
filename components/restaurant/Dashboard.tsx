import { useUser } from '@context/User';
import styles from './Dashboard.module.css';
import { useData } from '@context/Data';
import { IOrder } from 'types';
import { dateToMS, dateToText } from '@lib/utils';

export default function Dashboard() {
  const { vendor } = useUser();
  const { vendorUpcomingOrders } = useData();

  const orderMap: Record<string, IOrder[]> = {};
  for (const order of vendorUpcomingOrders.data) {
    const deliveryDate = dateToMS(order.delivery.date);
    if (!orderMap[deliveryDate]) {
      orderMap[deliveryDate] = [];
    }
    orderMap[deliveryDate].push(order);
  }

  const orderGroups = [];
  for (const key in orderMap) {
    orderGroups.push({ date: key, orders: orderMap[key] });
  }

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
          {orderGroups.map(({ date, orders }) => (
            <div className={styles.group} key={date}>
              <h2>{dateToText(+date)}</h2>
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
                </tbody>
              </table>
            </div>
          ))}
        </>
      ) : (
        <p>No upcoming orders</p>
      )}
    </section>
  );
}
