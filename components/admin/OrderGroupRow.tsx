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
import { pdf } from '@react-pdf/renderer';
import Labels from './Labels';

type Props = {
  slug: string;
  orderGroup: OrderGroup;
  orderGroups: OrderGroup[];
};

export default function OrderGroupRow({
  slug,
  orderGroup,
  orderGroups,
}: Props) {
  async function generateAndDownloadLabels(deliveryDate: string) {
    const orders = [];
    for (const orderGroup of orderGroups) {
      if (orderGroup.deliveryDate === deliveryDate) {
        orders.push(...orderGroup.orders);
      }
    }
    const labels = [];
    for (const order of orders) {
      for (let i = 0; i < order.item.quantity; i++) {
        labels.push({
          customer: {
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            shift: order.company.shift,
          },
          restaurant: order.restaurant.name,
          item: {
            name: order.item.name,
            addons:
              order.item.optionalAddons || order.item.requiredAddons
                ? `${order.item.optionalAddons} ${order.item.requiredAddons}`
                : '',
            removed: order.item.removedIngredients || '',
          },
        });
      }
    }
    labels.sort((a, b) => {
      const restaurantComp = a.restaurant.localeCompare(b.restaurant);
      if (restaurantComp !== 0) return restaurantComp;
      return a.item.name.localeCompare(b.item.name);
    });

    const blob = await pdf(<Labels labels={labels} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Labels - ${dateToText(deliveryDate)}.pdf`;
    a.click();
  }

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
        {slug === 'upcoming-orders' && (
          <span
            onClick={() => generateAndDownloadLabels(orderGroup.deliveryDate)}
          >
            Labels <FiDownload />
          </span>
        )}
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
