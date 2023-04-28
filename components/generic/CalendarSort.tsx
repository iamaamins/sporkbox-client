import { useEffect, useState } from "react";
import { ICalendarSortProps } from "types";
import styles from "@styles/generic/CalendarSort.module.css";

export default function CalendarSort({
  setSorted,
  updatedRestaurants,
}: ICalendarSortProps) {
  // Hooks
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    // Sort items by price
    if (sortBy === "lowToHigh") {
      updatedRestaurants.map((updatedRestaurant) =>
        updatedRestaurant.items.sort((a, b) => a.price - b.price)
      );

      setSorted(() => ({ byLowToHigh: true, byHighToLow: false }));
    } else if (sortBy === "highToLow") {
      updatedRestaurants.map((updatedRestaurant) =>
        updatedRestaurant.items.sort((a, b) => b.price - a.price)
      );

      setSorted(() => ({ byLowToHigh: false, byHighToLow: true }));
    }
  }, [sortBy, updatedRestaurants]);

  return (
    <form className={styles.calendar_sort}>
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option hidden>Sort by price</option>
        <option value="lowToHigh">Low to high</option>
        <option value="highToLow">High to low</option>
      </select>
    </form>
  );
}
