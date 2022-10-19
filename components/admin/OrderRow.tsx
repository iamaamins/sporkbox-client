import Link from "next/link";
import { IOrderProps } from "types";
import styles from "@styles/admin/OrderRow.module.css";

export default function OrderRow({ order }: IOrderProps) {
  return (
    <tr key={order._id} className={styles.order_row}>
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
