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
  const [twentyAndUnder, setTwentyAndUnder] = useState(false);
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
      updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
        ...updatedRestaurant,
        items: updatedRestaurant.items.filter((item) =>
          tags.some((tag) => item.tags.toLowerCase().includes(tag))
        ),
      }));
    }

    // Filter items with price $20 and less
    if (twentyAndUnder) {
      updatedRestaurants = updatedRestaurants.map((updatedRestaurant) => ({
        ...updatedRestaurant,
        items: updatedRestaurant.items.filter((item) => item.price <= 20),
      }));
    }

    // Update states
    setShowCalendarFilters(false);
    setUpdatedRestaurants(
      updatedRestaurants.filter(
        (updatedRestaurant) => updatedRestaurant.items.length > 0
      )
    );
  }

  return (
    <div className={styles.calendar_filters_modal}>
      <h2>Filters</h2>

      <form onSubmit={filterItemsByTags}>
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

        <div className={styles.twenty_and_under}>
          <input
            type="checkbox"
            id="twentyAndUnder"
            checked={twentyAndUnder}
            onChange={(e) => setTwentyAndUnder(e.target.checked)}
          />
          <label htmlFor="twentyAndUnder">$20 and under</label>
        </div>

        <input type="submit" value="Apply" />
      </form>
    </div>
  );
}
