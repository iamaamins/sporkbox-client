import Link from 'next/link';
import { ICustomerOrderProps } from 'types';
import { dateToText } from '@lib/utils';
import styles from './Orders.module.css';

export default function Orders({ orders }: ICustomerOrderProps) {
  return (
    <table className={styles.orders}>
      <thead>
        <tr>
          <th>Delivery date</th>
          <th>Shift</th>
          <th className={styles.hide_on_mobile}>Restaurant</th>
          <th>Item</th>
          <th>Quantity</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td className={styles.important}>
              <Link href={`/dashboard/${order._id}`}>
                <a>{dateToText(order.delivery.date)}</a>
              </Link>
            </td>
            <td className={styles.shift}>{order.company.shift}</td>
            <td className={styles.hide_on_mobile}>{order.restaurant.name}</td>
            <td>{order.item.name}</td>
            <td>{order.item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
