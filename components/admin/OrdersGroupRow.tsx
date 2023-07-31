import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { IOrdersGroupRowProps } from 'types';
import { FiDownload } from 'react-icons/fi';
import styles from '@styles/admin/OrdersGroupRow.module.css';
import { convertDateToMS, convertDateToText } from '@utils/index';
import { orderData, orderFileName, orderHeaders } from '@utils/csv';

export default function OrdersGroupRow({
  slug,
  ordersGroup,
}: IOrdersGroupRowProps) {
  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/${slug}/${ordersGroup.company._id}/${convertDateToMS(
            ordersGroup.deliveryDate
          )}`}
        >
          <a>{convertDateToText(ordersGroup.deliveryDate)} </a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{ordersGroup.company.name}</td>
      <td className={styles.shift}>{ordersGroup.company.shift}</td>
      <td className={`${styles.restaurants} ${styles.hide_on_mobile}`}>
        {ordersGroup.restaurants.map((restaurant) => (
          <span key={restaurant}>{restaurant}</span>
        ))}
      </td>
      <td>{ordersGroup.customers.length}</td>
      <td>{ordersGroup.orders.length}</td>
      <td className={styles.action}>
        <CSVLink
          headers={orderHeaders}
          data={orderData(ordersGroup)}
          filename={orderFileName(ordersGroup)}
        >
          CSV <FiDownload />
        </CSVLink>
      </td>
    </tr>
  );
}
