import { tags } from "@utils/index";
import { ICalendarFiltersProps } from "types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "@styles/generic/CalendarFiltersModal.module.css";

export default function CalendarFiltersModal({
  restaurants,
  setRestaurants,
  setUpdatedRestaurants,
  setShowCalendarFilters,
}: ICalendarFiltersProps) {
  // Hooks
  const [sortBy, setSortBy] = useState("");
  const [tagsData, setTagsData] = useState(
    tags.reduce((acc, curr) => ({ ...acc, [curr.toLowerCase()]: false }), {})
  );

  // Handle tags change
  function handleTagsChange(e: ChangeEvent<HTMLInputElement>) {
    setTagsData((currState) => ({
      ...currState,
      [e.target.id.toLowerCase()]: e.target.checked,
    }));
  }

  // Filter items by tags
  function filterItemsByTags(e: FormEvent) {
    e.preventDefault();

    // Create updated restaurants
    let updatedRestaurants = restaurants;

    // Create tags array
    const tags = Object.entries(tagsData)
      .filter((data) => data[1] === true)
      .map((data) => data[0]);

    // Sort items by price
    if (sortBy === "lowToHigh") {
      setRestaurants((currState) =>
        currState.map((restaurant) => ({
          ...restaurant,
          items: restaurant.items.sort((a, b) => a.price - b.price),
        }))
      );
    } else if (sortBy === "highToLow") {
      setRestaurants((currState) =>
        currState.map((restaurant) => ({
          ...restaurant,
          items: restaurant.items.sort((a, b) => b.price - a.price),
        }))
      );
    }

    // Filter items
    if (tags.length > 0) {
      updatedRestaurants = updatedRestaurants
        .map((updatedRestaurant) => ({
          ...updatedRestaurant,
          items: updatedRestaurant.items.filter((item) =>
            tags.some((tag) => item.tags.toLowerCase().includes(tag))
          ),
        }))
        .filter((updatedRestaurant) => updatedRestaurant.items.length > 0);
    }

    // Update states
    setShowCalendarFilters(false);
    setUpdatedRestaurants(updatedRestaurants);
  }

  return (
    <div className={styles.calendar_filters_modal}>
      <h2>Filters</h2>

      <form onSubmit={filterItemsByTags}>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option hidden>Sort items</option>
          <option value="lowToHigh">Price: Low to high</option>
          <option value="highToLow">Price: High to low</option>
        </select>

        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <input
                type="checkbox"
                id={tag}
                onChange={handleTagsChange}
                checked={tagsData[tag.toLowerCase() as keyof object]}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>

        <input type="submit" value="Apply" />
      </form>
    </div>
  );
}
