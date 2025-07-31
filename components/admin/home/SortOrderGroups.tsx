import { dateToMS } from '@lib/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OrderGroup, SortedOrderGroups } from 'types';
import styles from './SortOrderGroups.module.css';

type Props = {
  orderGroups: OrderGroup[];
  setSorted: Dispatch<SetStateAction<SortedOrderGroups>>;
};

export default function SortOrderGroups({ setSorted, orderGroups }: Props) {
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (category === 'company') {
      orderGroups.sort((a, b) =>
        a.company.name.toLowerCase().localeCompare(b.company.name.toLowerCase())
      );

      setSorted((prevState) => ({
        ...prevState,
        byCompany: true,
        byDeliveryDate: false,
      }));
    }

    if (category === 'deliveryDate') {
      orderGroups.sort(
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
        <option hidden>Sort orders</option>
        <option value='company'>By company</option>
        <option value='deliveryDate'>By delivery date</option>
      </select>
    </div>
  );
}
