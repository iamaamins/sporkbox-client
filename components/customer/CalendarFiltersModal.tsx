import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { UpcomingRestaurant } from 'types';
import { TAGS as tagFilters } from '@lib/utils';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import styles from '@components/customer/CalendarFiltersModal.module.css';

type Props = {
  restaurants: UpcomingRestaurant[];
  setShowCalendarFilters: Dispatch<SetStateAction<boolean>>;
  setUpdatedRestaurants: Dispatch<SetStateAction<UpcomingRestaurant[]>>;
};

export default function CalendarFiltersModal({
  restaurants,
  setUpdatedRestaurants,
  setShowCalendarFilters,
}: Props) {
  const additionalFilters = ['$20 and under'] as const;
  const allInitialFilters = [...tagFilters, ...additionalFilters] as const;

  type InitialFilters = {
    [key in (typeof allInitialFilters)[number]]: boolean;
  };

  const initialFilters = allInitialFilters.reduce(
    (acc, curr) => ({ ...acc, [curr]: false }),
    {} as InitialFilters
  );

  const router = useRouter();
  const { customer } = useUser();
  const [filtersData, setFiltersData] = useState(initialFilters);

  function handleFilterChange(e: ChangeEvent<HTMLInputElement>) {
    setFiltersData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));
  }

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

    // Update states
    setUpdatedRestaurants(
      updatedRestaurants.filter(
        (updatedRestaurant) => updatedRestaurant.items.length > 0
      )
    );
  }

  function filterItemsOnSubmit(e: FormEvent) {
    e.preventDefault();
    filterItems();
    setShowCalendarFilters(false);
    localStorage.setItem(
      `filters-${customer?._id}`,
      JSON.stringify(filtersData)
    );
  }

  useEffect(() => {
    filterItems();
  }, [restaurants]);

  useEffect(() => {
    const savedFilters = JSON.parse(
      localStorage.getItem(`filters-${customer?._id}`) as string
    );
    setFiltersData(savedFilters || initialFilters);
  }, [customer, router.isReady]);

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
