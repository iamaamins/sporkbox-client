import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UpcomingRestaurant } from 'types';
import styles from './PlaceOrderSort.module.css';

type Props = {
  updatedRestaurants: UpcomingRestaurant[];
  setSorted: Dispatch<
    SetStateAction<{ byLowToHigh: boolean; byHighToLow: boolean }>
  >;
};

export default function PlaceOrderSort({
  setSorted,
  updatedRestaurants,
}: Props) {
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    if (sortBy === 'lowToHigh') {
      updatedRestaurants.map((updatedRestaurant) =>
        updatedRestaurant.items.sort((a, b) => a.price - b.price)
      );
      setSorted(() => ({ byLowToHigh: true, byHighToLow: false }));
    } else if (sortBy === 'highToLow') {
      updatedRestaurants.map((updatedRestaurant) =>
        updatedRestaurant.items.sort((a, b) => b.price - a.price)
      );
      setSorted(() => ({ byLowToHigh: false, byHighToLow: true }));
    }
  }, [sortBy, updatedRestaurants]);

  return (
    <form className={styles.container}>
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option hidden>Sort by price</option>
        <option value='lowToHigh'>Low to high</option>
        <option value='highToLow'>High to low</option>
      </select>
    </form>
  );
}
