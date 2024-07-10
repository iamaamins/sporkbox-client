import Link from 'next/link';
import { DownloadAbles, LabelFilters, OrderGroup } from 'types';
import { FiDownload } from 'react-icons/fi';
import styles from './OrderGroupRow.module.css';
import { dateToMS, dateToText } from '@lib/utils';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  slug: string;
  orderGroup: OrderGroup;
  orderGroups: OrderGroup[];
  setRestaurants: Dispatch<SetStateAction<string[]>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setDownloadAbles: Dispatch<SetStateAction<DownloadAbles>>;
  setOrderGroup: Dispatch<SetStateAction<OrderGroup | undefined>>;
  setLabelFilters: Dispatch<SetStateAction<LabelFilters | undefined>>;
};

export default function OrderGroupRow({
  slug,
  orderGroup,
  orderGroups,
  setShowModal,
  setOrderGroup,
  setRestaurants,
  setLabelFilters,
  setDownloadAbles,
}: Props) {
  function selectRestaurants(downloadAbles: DownloadAbles) {
    const companyCode = orderGroup.company.code;
    const deliveryDate = orderGroup.deliveryDate;

    const restaurants = [];
    for (const group of orderGroups) {
      if (
        group.company.code === companyCode &&
        group.deliveryDate === deliveryDate
      ) {
        restaurants.push(...group.restaurants);
      }
    }
    const uniqueRestaurants: string[] = [];
    for (const restaurant of restaurants) {
      if (!uniqueRestaurants.includes(restaurant)) {
        uniqueRestaurants.push(restaurant);
      }
    }
    downloadAbles === 'CSV' && setOrderGroup(orderGroup);
    downloadAbles === 'labels' &&
      setLabelFilters({ companyCode, deliveryDate });
    setRestaurants(uniqueRestaurants);
    setDownloadAbles(downloadAbles);
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
          <span onClick={() => selectRestaurants('labels')}>
            Labels <FiDownload />
          </span>
        )}
        <span onClick={() => selectRestaurants('CSV')}>
          CSV <FiDownload />
        </span>
      </td>
    </tr>
  );
}
