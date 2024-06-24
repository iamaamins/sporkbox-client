import Link from 'next/link';
import { DownloadAbles, OrderGroup } from 'types';
import { FiDownload } from 'react-icons/fi';
import styles from './OrderGroupRow.module.css';
import { dateToMS, dateToText } from '@lib/utils';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  slug: string;
  orderGroup: OrderGroup;
  orderGroups: OrderGroup[];
  setRestaurants: Dispatch<SetStateAction<string[]>>;
  setDeliveryDate: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setDownloadAbles: Dispatch<SetStateAction<DownloadAbles>>;
  setOrderGroup: Dispatch<SetStateAction<OrderGroup | undefined>>;
};

export default function OrderGroupRow({
  slug,
  orderGroup,
  orderGroups,
  setShowModal,
  setOrderGroup,
  setRestaurants,
  setDeliveryDate,
  setDownloadAbles,
}: Props) {
  function selectRestaurants(
    orderGroup: OrderGroup,
    downloadAbles: DownloadAbles
  ) {
    const deliveryDate = orderGroup.deliveryDate;
    const restaurants = [];
    for (const orderGroup of orderGroups) {
      if (orderGroup.deliveryDate === deliveryDate) {
        restaurants.push(...orderGroup.restaurants);
      }
    }
    const uniqueRestaurants: string[] = [];
    for (const restaurant of restaurants) {
      if (!uniqueRestaurants.includes(restaurant)) {
        uniqueRestaurants.push(restaurant);
      }
    }
    setDownloadAbles(downloadAbles);
    setRestaurants(uniqueRestaurants);
    setDeliveryDate(deliveryDate);
    setOrderGroup(orderGroup);
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
          <span onClick={() => selectRestaurants(orderGroup, 'labels')}>
            Labels <FiDownload />
          </span>
        )}
        <span onClick={() => selectRestaurants(orderGroup, 'CSV')}>
          CSV <FiDownload />
        </span>
      </td>
    </tr>
  );
}
