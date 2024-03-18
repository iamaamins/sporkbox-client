import { dateToMS } from '@lib/utils';
import { useEffect, useState } from 'react';
import { ISortOrdersGroupsProps } from 'types';
import styles from './SortOrdersGroups.module.css';

export default function SortOrdersGroups({
  setSorted,
  ordersGroups,
}: ISortOrdersGroupsProps) {
  // Hooks
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (category === 'company') {
      ordersGroups.sort((a, b) =>
        a.company.name.toLowerCase().localeCompare(b.company.name.toLowerCase())
      );

      setSorted((prevState) => ({
        ...prevState,
        byCompany: true,
        byDeliveryDate: false,
      }));
    }

    if (category === 'deliveryDate') {
      ordersGroups.sort(
        (a, b) => dateToMS(a.deliveryDate) - dateToMS(b.deliveryDate)
      );

      setSorted((prevState) => ({
        ...prevState,
        byCompany: false,
        byDeliveryDate: true,
      }));
    }
  }, [category]);

  return (
    <div className={styles.sort_orders_groups}>
      <select
        name='category'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option hidden aria-hidden>
          Sort orders
        </option>
        <option value='company'>By company</option>
        <option value='deliveryDate'>By delivery date</option>
      </select>
    </div>
  );
}
