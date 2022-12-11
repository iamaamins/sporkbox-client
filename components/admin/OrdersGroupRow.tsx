import Link from "next/link";
import { IOrdersGroupProps } from "types";
import { convertDateToMS, textToSlug } from "@utils/index";
import styles from "@styles/admin/OrdersGroupRow.module.css";
import { FiDownload } from "react-icons/fi";

export default function OrdersGroupRow({ ordersGroup }: IOrdersGroupProps) {
  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/orders-groups/${textToSlug(
            ordersGroup.companyName
          )}/${convertDateToMS(ordersGroup.deliveryDate)}`}
        >
          <a>{ordersGroup.deliveryDate}</a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{ordersGroup.companyName}</td>
      <td className={`${styles.restaurants} ${styles.hide_on_mobile}`}>
        {ordersGroup.restaurants.map((restaurant) => (
          <span key={restaurant}>{restaurant}</span>
        ))}
      </td>
      <td>{ordersGroup.orders.length}</td>
      <td>
        CSV <FiDownload />
      </td>
    </tr>
  );
}
