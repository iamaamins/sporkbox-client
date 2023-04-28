import { tags } from "@utils/index";
import { ICalendarFiltersProps } from "types";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@styles/generic/CalendarFiltersModal.module.css";

export default function CalendarFiltersModal({
  restaurants,
  setUpdatedRestaurants,
  setShowCalendarFilters,
}: ICalendarFiltersProps) {
  // Hooks
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

    // Filter items by dietary tags
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

      <form onSubmit={filterItemsByTags} className={styles.tags}>
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

        <input type="submit" value="Apply" />
      </form>
    </div>
  );
}
