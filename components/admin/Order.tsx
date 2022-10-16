import Link from "next/link";
import { IOrderProps } from "types";
import styles from "@styles/admin/Order.module.css";

export default function Order({ order }: IOrderProps) {
  console.log(order);
  return (
    <tr key={order._id} className={styles.order}>
      <td className={styles.important}>
        <Link href={`/admin/orders/${order._id}`}>
          <a>{order.customerName}</a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{order.companyName}</td>
      <td className={styles.hide_on_mobile}>{order.restaurantName}</td>
      <td>{order.deliveryDate}</td>
    </tr>
  );
}
