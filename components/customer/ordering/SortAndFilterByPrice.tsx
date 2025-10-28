import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UpcomingRestaurant } from 'types';
import styles from './SortAndFilterByPrice.module.css';

type Props = {
  restaurants: UpcomingRestaurant[];
  setUpdatedRestaurants: Dispatch<SetStateAction<UpcomingRestaurant[]>>;
};

export default function SortAndFilterByPrice({
  restaurants,
  setUpdatedRestaurants,
}: Props) {
  const [action, setAction] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (action === 'sortByLowToHigh') {
      setUpdatedRestaurants((prevState) =>
        prevState.map((restaurant) => ({
          ...restaurant,
          items: restaurant.items.sort((a, b) => a.price - b.price),
        }))
      );
    }

    if (action === 'sortByHighToLow') {
      setUpdatedRestaurants((prevState) =>
        prevState.map((restaurant) => ({
          ...restaurant,
          items: restaurant.items.sort((a, b) => b.price - a.price),
        }))
      );
    }

    if (action === 'filterByPrice' && budget) {
      setUpdatedRestaurants(
        restaurants.map((restaurant) => ({
          ...restaurant,
          items: restaurant.items.filter((item) => item.price <= +budget),
        }))
      );
    }
  }, [action, budget]);

  return (
    <form className={styles.container}>
      <select onChange={(e) => setAction(e.target.value)} value={action}>
        <option hidden>Sort & filter by price</option>
        <option value='sortByLowToHigh'>Sort by low to high</option>
        <option value='sortByHighToLow'>Sort by high to low</option>
        <option value='filterByPrice'>Filter by price</option>
      </select>
      {action === 'filterByPrice' && (
        <input
          type='text'
          value={budget}
          placeholder='Max budget'
          onChange={(e) => setBudget(e.target.value)}
        />
      )}
    </form>
  );
}
