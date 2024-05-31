import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './SelectRestaurants.module.css';

type Props = {
  restaurants: string[];
  generateAndDownloadLabels: (
    e: FormEvent,
    selectedRestaurants: string[]
  ) => Promise<void>;
};

export default function SelectRestaurants({
  restaurants,
  generateAndDownloadLabels,
}: Props) {
  const [selectedRestaurants, setSelectedRestaurants] =
    useState<string[]>(restaurants);

  function handleChange(e: ChangeEvent<HTMLInputElement>, restaurant: string) {
    setSelectedRestaurants((prevState) => {
      if (e.target.checked) {
        return [...prevState, restaurant];
      }
      return prevState.filter((el) => el !== restaurant);
    });
  }

  useEffect(() => {
    setSelectedRestaurants(restaurants);
  }, [restaurants]);

  return (
    <div className={styles.container}>
      <h2>Select restaurants</h2>
      <form>
        {restaurants.map((restaurant, index) => (
          <div key={index} className={styles.restaurant}>
            <label htmlFor={restaurant}>{restaurant}</label>
            <input
              type='checkbox'
              id={restaurant}
              onChange={(e) => handleChange(e, restaurant)}
              checked={selectedRestaurants.includes(restaurant)}
            />
          </div>
        ))}
        <button
          disabled={selectedRestaurants.length === 0}
          onClick={(e) => generateAndDownloadLabels(e, selectedRestaurants)}
        >
          Download
        </button>
      </form>
    </div>
  );
}
