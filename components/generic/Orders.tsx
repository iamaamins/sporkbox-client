import Link from "next/link";
import { ICustomerOrderProps } from "types";
import { convertDateToText } from "@utils/index";
import styles from "@styles/generic/Orders.module.css";

export default function Orders({ orders }: ICustomerOrderProps) {
  return (
    <table className={styles.orders}>
      <thead>
        <tr>
          <th>Item</th>
          <th className={styles.hide_on_mobile}>Quantity</th>
          <th className={styles.hide_on_mobile}>Restaurant</th>
          <th>Delivery date</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td className={styles.important}>
              <Link href={`/dashboard/${order._id}`}>
                <a>{order.item.name}</a>
              </Link>
            </td>
            <td className={styles.hide_on_mobile}>{order.item.quantity}</td>
            <td className={styles.hide_on_mobile}>{order.restaurantName}</td>
            <td>{convertDateToText(order.deliveryDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
