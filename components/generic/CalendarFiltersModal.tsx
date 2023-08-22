import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { ICalendarFiltersProps } from 'types';
import { tags as tagFilters } from '@utils/index';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from '@styles/generic/CalendarFiltersModal.module.css';

export default function CalendarFiltersModal({
  restaurants,
  setUpdatedRestaurants,
  setShowCalendarFilters,
}: ICalendarFiltersProps) {
  // All filters
  const additionalFilters = ['$20 and under'] as const;
  const allInitialFilters = [...tagFilters, ...additionalFilters] as const;

  // Initial filters type
  type InitialFilters = {
    [key in (typeof allInitialFilters)[number]]: boolean;
  };

  // Initial filters
  const initialFilters = allInitialFilters.reduce(
    (acc, curr) => ({ ...acc, [curr]: false }),
    {} as InitialFilters
  );

  // Hooks
  const router = useRouter();
  const { customer } = useUser();
  const [filtersData, setFiltersData] = useState(initialFilters);

  // Filter items
  useEffect(() => {
    filterItems();
  }, [restaurants]);

  useEffect(() => {
    // Get filters data from local storage
    const savedFilters = JSON.parse(
      localStorage.getItem(`filters-${customer?._id}`) as string
    );

    // Update state
    setFiltersData(savedFilters || initialFilters);
  }, [customer, router.isReady]);

  // Handle tags change
  function handleFilterChange(e: ChangeEvent<HTMLInputElement>) {
    setFiltersData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));
  }

  // Filter items by tags
  function filterItems() {
    // Create updated restaurants
    let updatedRestaurants = restaurants;

    // All filters type
    type AllFilters = (typeof allInitialFilters)[number][];

    // All filters array
    const allFilters = Object.entries(filtersData)
      .filter((data) => data[1] === true)
      .map((data) => data[0]) as AllFilters;

    // Tag filters type
    type TagFilters = (typeof tagFilters)[number][];

    // Only keep tag filters
    const tagsFilters = allFilters.filter(
      (filter) =>
        !additionalFilters.some(
          (additionalFilter) => additionalFilter === filter
        )
    ) as TagFilters;

    // Filter items by dietary tags
    if (tagsFilters.length > 0) {
      updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
        ...updatedRestaurant,
        items: updatedRestaurant.items.filter((item) =>
          tagsFilters.some((tag) =>
            item.tags.toLowerCase().includes(tag.toLowerCase())
          )
        ),
      }));
    }

    // Filter items with price $20 and less
    if (allFilters.includes('$20 and under')) {
      updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
        ...updatedRestaurant,
        items: updatedRestaurant.items.filter((item) => item.price <= 20),
      }));
    }

    // // Filter items without pork
    // if (allFilters.includes('Pork-Free')) {
    //   updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
    //     ...updatedRestaurant,
    //     items: updatedRestaurant.items.filter(
    //       (item) => !item.tags.toLowerCase().includes('contains pork')
    //     ),
    //   }));
    // }

    // Update states
    setUpdatedRestaurants(
      updatedRestaurants.filter(
        (updatedRestaurant) => updatedRestaurant.items.length > 0
      )
    );
  }

  // Filter items by tags
  function filterItemsOnSubmit(e: FormEvent) {
    // Prevent default
    e.preventDefault();

    // Filter items and remove modal
    filterItems();
    setShowCalendarFilters(false);

    // Save filters data to local storage
    localStorage.setItem(
      `filters-${customer?._id}`,
      JSON.stringify(filtersData)
    );
  }

  return (
    <div className={styles.calendar_filters_modal}>
      <h2>Filters</h2>

      <form onSubmit={filterItemsOnSubmit}>
        {allInitialFilters.map((filter, index) => (
          <div key={index} className={styles.tag}>
            <input
              type='checkbox'
              id={filter}
              onChange={handleFilterChange}
              checked={filtersData[filter]}
            />
            <label htmlFor={filter}>{filter}</label>
          </div>
        ))}

        <input type='submit' value='Apply' />
      </form>
    </div>
  );
}
