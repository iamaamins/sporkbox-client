import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useEffect, useState } from "react";
import { convertDateToMS } from "@utils/index";
import { IFilterRestaurantsProps } from "types";
import styles from "@styles/generic/FilterRestaurants.module.css";

export default function FilterRestaurants({
  shifts,
  setRestaurants,
}: IFilterRestaurantsProps) {
  // Hooks
  const router = useRouter();
  const [shift, setShift] = useState("");
  const { upcomingRestaurants, upcomingDates } = useData();

  // Filter restaurants on shift change
  useEffect(() => {
    if (upcomingDates.length > 0 && router.isReady) {
      // Upcoming date and shift
      const upcomingDate = upcomingDates.find(
        (upcomingDate) => upcomingDate.toString() === router.query.date
      );

      if (upcomingDate) {
        // Get upcoming restaurants on a date
        const upcomingRestaurantsOnDate = upcomingRestaurants.data.filter(
          (upcomingRestaurant) =>
            convertDateToMS(upcomingRestaurant.date) === upcomingDate
        );

        setRestaurants(() =>
          shift === ""
            ? upcomingRestaurantsOnDate
            : upcomingRestaurantsOnDate.filter(
                (restaurant) => restaurant.company.shift === shift
              )
        );
      }
    }
  }, [shift]);

  return (
    <div className={styles.filter_restaurants}>
      <select
        name="shift"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      >
        <option hidden aria-hidden>
          Filter restaurants
        </option>
        {shifts.map((shift, index) => (
          <option key={index} value={shift}>
            By {shift}
          </option>
        ))}
      </select>
    </div>
  );
}
