import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { IOrdersGroupRowProps } from 'types';
import { FiDownload } from 'react-icons/fi';
import styles from './OrdersGroupRow.module.css';
import { dateToMS, dateToText } from '@lib/utils';
import {
  formatOrderDataToCSV,
  createOrderCSVFileName,
  orderCSVHeaders,
} from 'lib/csv';

export default function OrdersGroupRow({
  slug,
  ordersGroup,
}: IOrdersGroupRowProps) {
  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/${slug}/${ordersGroup.company._id}/${dateToMS(
            ordersGroup.deliveryDate
          )}`}
        >
          <a>{dateToText(ordersGroup.deliveryDate)} </a>
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
          headers={orderCSVHeaders}
          data={formatOrderDataToCSV(ordersGroup)}
          filename={createOrderCSVFileName(ordersGroup)}
        >
          CSV <FiDownload />
        </CSVLink>
      </td>
    </tr>
  );
}
