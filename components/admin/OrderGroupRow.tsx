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
import { Dispatch, SetStateAction } from 'react';

type Props = {
  slug: string;
  orderGroup: OrderGroup;
  orderGroups: OrderGroup[];
  setRestaurants: Dispatch<SetStateAction<string[]>>;
  setDeliveryDate: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export default function OrderGroupRow({
  slug,
  orderGroup,
  orderGroups,
  setShowModal,
  setRestaurants,
  setDeliveryDate,
}: Props) {
  function selectRestaurants(deliveryDate: string) {
    const restaurants = [];
    for (const orderGroup of orderGroups) {
      if (orderGroup.deliveryDate === deliveryDate) {
        restaurants.push(...orderGroup.restaurants);
      }
    }
    setDeliveryDate(deliveryDate);
    setRestaurants(restaurants);
    setShowModal(true);
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
          <span onClick={() => selectRestaurants(orderGroup.deliveryDate)}>
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
