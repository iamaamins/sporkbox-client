import { Customer, Guest, UpcomingRestaurant } from 'types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './PlaceOrderFilters.module.css';
import { useData } from '@context/Data';
import Image from 'next/image';

type Props = {
  isAdmin?: boolean;
  isCompanyAdmin?: boolean;
  user: Customer | Guest | null;
  restaurants: UpcomingRestaurant[];
  setUpdatedRestaurants: Dispatch<SetStateAction<UpcomingRestaurant[]>>;
};

export default function PlaceOrderFilters({
  isAdmin,
  isCompanyAdmin,
  user,
  restaurants,
  setUpdatedRestaurants,
}: Props) {
  const { dietaryTags } = useData();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const isMatchedFilter = (tag: string) => selectedFilters.includes(tag);

  function filterItems(filters: string[]) {
    const updatedRestaurants = restaurants
      .map((restaurant) => ({
        ...restaurant,
        items: restaurant.items.filter((item) =>
          filters.every((filter) =>
            item.tags.toLowerCase().includes(filter.toLowerCase())
          )
        ),
      }))
      .filter((restaurant) => restaurant.items.length > 0);

    setUpdatedRestaurants(updatedRestaurants);
  }

  function updateFilters(tag: string) {
    const updatedFilters = isMatchedFilter(tag)
      ? selectedFilters.filter((filter) => filter !== tag)
      : [...selectedFilters, tag];

    filterItems(updatedFilters);

    const adminKey = `${isAdmin ? 'admin' : isCompanyAdmin && 'company-admin'}`;
    const filterKey = `filters-${user?._id}`;

    localStorage.setItem(
      isAdmin || isCompanyAdmin ? `${adminKey}-${filterKey}` : filterKey,
      JSON.stringify(updatedFilters)
    );

    setSelectedFilters(updatedFilters);
  }

  // Get saved filters/user food preferences
  useEffect(() => {
    if (user && 'foodPreferences' in user) {
      const adminKey = `${
        isAdmin ? 'admin' : isCompanyAdmin && 'company-admin'
      }`;
      const filterKey = `filters-${user._id}`;

      const savedFilters = JSON.parse(
        localStorage.getItem(
          isAdmin || isCompanyAdmin ? `${adminKey}-${filterKey}` : filterKey
        ) as string
      );

      setSelectedFilters(savedFilters || user.foodPreferences);
    }
  }, [user]);

  // Filter items when restaurants change
  useEffect(() => {
    filterItems(selectedFilters);
  }, [restaurants]);

  return (
    <div className={styles.container}>
      <p>Meal preferences</p>
      <div className={styles.preference_icons}>
        {dietaryTags.data.map((tag, index) => (
          <div
            key={index}
            onClick={() => updateFilters(tag)}
            className={`${styles.preference_icon} ${
              isMatchedFilter(tag) && styles.matched
            }`}
          >
            <Image
              width={32}
              height={32}
              alt={`${tag} icon`}
              title={tag}
              src={`/customer/${tag.toLowerCase().replace(' ', '-')}.png`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
