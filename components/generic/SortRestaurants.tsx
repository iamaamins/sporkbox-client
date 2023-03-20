import { useEffect, useState } from "react";
import { IFilterRestaurantsProps } from "types";
import styles from "@styles/generic/SortRestaurants.module.css";
import { useData } from "@context/Data";
import { convertDateToMS } from "@utils/index";
import { useRouter } from "next/router";

export default function SortRestaurants({
  setRestaurants,
}: IFilterRestaurantsProps) {
  // Hooks
  const router = useRouter();
  const [shift, setShift] = useState("");
  const { upcomingRestaurants, upcomingDatesAndShifts } = useData();

  useEffect(() => {
    setShift("");
  }, [router]);

  useEffect(() => {
    if (upcomingDatesAndShifts.length > 0 && router.isReady) {
      // Upcoming date and shift
      const upcomingDateAndShift = upcomingDatesAndShifts.find(
        (upcomingDateAndShift) =>
          upcomingDateAndShift.date.toString() === router.query.date
      );

      if (upcomingDateAndShift) {
        // Get upcoming restaurants on a date
        const upcomingRestaurantsOnDate = upcomingRestaurants.data.filter(
          (upcomingRestaurant) =>
            convertDateToMS(upcomingRestaurant.date) ===
            upcomingDateAndShift?.date
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
    <div className={styles.sort_restaurants}>
      <select
        name="shift"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      >
        <option hidden aria-hidden>
          Sort restaurants
        </option>
        <option value="day">By day</option>
        <option value="night">By night</option>
      </select>
    </div>
  );
}
