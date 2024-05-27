import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { OrderGroup } from 'types';
import { FiDownload } from 'react-icons/fi';
import styles from './OrderGroupRow.module.css';
import { dateToMS, dateToText } from '@lib/utils';
import {
  formatOrderDataToCSV,
  createOrderCSVFileName,
  orderCSVHeaders,
} from '@lib/csv';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Labels from './Labels';

type Props = {
  slug: string;
  orderGroup: OrderGroup;
};

export default function OrderGroupRow({ slug, orderGroup }: Props) {
  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/${slug}/${orderGroup.company._id}/${dateToMS(
            orderGroup.deliveryDate
          )}`}
        >
          <a>{dateToText(orderGroup.deliveryDate)} </a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{orderGroup.company.name}</td>
      <td className={styles.shift}>{orderGroup.company.shift}</td>
      <td className={`${styles.restaurants} ${styles.hide_on_mobile}`}>
        {orderGroup.restaurants.map((restaurant) => (
          <span key={restaurant}>{restaurant}</span>
        ))}
      </td>
      <td>{orderGroup.customers.length}</td>
      <td>{orderGroup.orders.length}</td>
      <td className={styles.actions}>
        <PDFDownloadLink
          document={<Labels orders={orderGroup.orders} />}
          fileName={`Labels-${dateToText(orderGroup.deliveryDate)}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              'Loading...'
            ) : (
              <>
                Labels <FiDownload />
              </>
            )
          }
        </PDFDownloadLink>
        <CSVLink
          headers={orderCSVHeaders}
          data={formatOrderDataToCSV(orderGroup)}
          filename={createOrderCSVFileName(orderGroup)}
        >
          CSV <FiDownload />
        </CSVLink>
      </td>
    </tr>
  );
}
