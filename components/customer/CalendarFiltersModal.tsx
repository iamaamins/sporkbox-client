import { useUser } from '@context/User';
import { Customer, UpcomingRestaurant } from 'types';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import styles from '@components/customer/CalendarFiltersModal.module.css';
import { useData } from '@context/Data';

type Props = {
  customer: Customer | null;
  restaurants: UpcomingRestaurant[];
  setShowCalendarFilters: Dispatch<SetStateAction<boolean>>;
  setUpdatedRestaurants: Dispatch<SetStateAction<UpcomingRestaurant[]>>;
};

export default function CalendarFiltersModal({
  customer,
  restaurants,
  setUpdatedRestaurants,
  setShowCalendarFilters,
}: Props) {
  const { dietaryTags } = useData();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const additionalFilters = ['$20 and under'] as const;
  const filters = [...dietaryTags.data, ...additionalFilters] as const;

  function handleFilterChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedFilters((prevState) =>
      e.target.checked
        ? [...prevState, e.target.id]
        : prevState.filter((el) => el !== e.target.id)
    );
  }

  function filterItems() {
    const selectedDietaryTags = selectedFilters.filter(
      (filter) =>
        !additionalFilters.some(
          (additionalFilter) => additionalFilter === filter
        )
    );
    let updatedRestaurants = restaurants;

    // Filter items by dietary tags
    if (selectedDietaryTags.length > 0) {
      updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
        ...updatedRestaurant,
        items: updatedRestaurant.items.filter((item) =>
          selectedDietaryTags.every((dietaryTag) =>
            item.tags.toLowerCase().includes(dietaryTag.toLowerCase())
          )
        ),
      }));
    }

    // Filter items with price $20 and less
    if (selectedFilters.includes('$20 and under')) {
      updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
        ...updatedRestaurant,
        items: updatedRestaurant.items.filter((item) => item.price <= 20),
      }));
    }

    // Update state
    setUpdatedRestaurants(
      updatedRestaurants.filter(
        (updatedRestaurant) => updatedRestaurant.items.length > 0
      )
    );
  }

  function filterItemsOnSubmit(e: FormEvent) {
    e.preventDefault();
    if (!customer) return;
    filterItems();
    setShowCalendarFilters(false);
    localStorage.setItem(
      `filters-${customer._id}`,
      JSON.stringify(selectedFilters)
    );
  }

  useEffect(() => {
    filterItems();
  }, [restaurants]);

  useEffect(() => {
    if (customer && customer.foodPreferences) {
      const savedFilters = JSON.parse(
        localStorage.getItem(`filters-${customer._id}`) as string
      );
      setSelectedFilters(savedFilters || customer.foodPreferences);
    }
  }, [customer]);

  return (
    <div className={styles.container}>
      <h2>Filters</h2>
      <form onSubmit={filterItemsOnSubmit}>
        <div className={styles.filters}>
          {filters.map((filter, index) => (
            <div key={index} className={styles.filter}>
              <input
                type='checkbox'
                id={filter}
                onChange={handleFilterChange}
                checked={selectedFilters.includes(filter)}
              />
              <label htmlFor={filter}>{filter}</label>
            </div>
          ))}
        </div>
        <button type='submit'>Apply</button>
      </form>
    </div>
  );
}
