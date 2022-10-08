import Link from "next/link";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { convertDate, groupBy } from "@utils/index";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  const { scheduledRestaurants } = useData();
  const [currGroup, setCurrGroup] = useState(0);
  const [restaurantGroups, setRestaurantGroups] = useState(null);

  useEffect(() => {
    if (scheduledRestaurants) {
      // Groups restaurants by scheduled on date
      const groups = groupBy(
        "scheduledOn",
        scheduledRestaurants,
        "restaurants"
      );

      // Update state
      setRestaurantGroups(groups);
    }
  }, [scheduledRestaurants]);

  // Current day
  const currentDay = (groups) => convertDate(groups[currGroup].scheduledOn);

  // Handle next day
  const handleNextDay = (groups) => {
    setCurrGroup(currGroup < groups.length - 1 ? currGroup + 1 : currGroup);
  };

  // Handle previous day
  const handlePrevDay = () => {
    setCurrGroup(currGroup > 0 ? currGroup - 1 : currGroup);
  };

  // Current restaurants
  const currRestaurants = (groups) => groups[currGroup].restaurants;

  return (
    <section className={styles.calendar}>
      {!restaurantGroups ||
        (restaurantGroups.length === 0 && <h2>No restaurants</h2>)}

      {restaurantGroups && restaurantGroups.length > 0 && (
        <>
          <div className={styles.title_and_controller}>
            <h2 className={styles.calendar_title}>Upcoming week</h2>

            <div className={styles.controller}>
              <p
                onClick={handlePrevDay}
                className={`${styles.previous_day} ${
                  currGroup === 0 && styles.disabled
                }`}
              >
                <MdKeyboardArrowLeft /> Previous day
              </p>
              <p className={styles.current_day}>
                {currentDay(restaurantGroups)}
              </p>
              <p
                onClick={() => handleNextDay(restaurantGroups)}
                className={`${styles.next_day} ${
                  currGroup === restaurantGroups.length - 1 && styles.disabled
                }`}
              >
                Next day <MdKeyboardArrowRight />
              </p>
            </div>
          </div>

          {currRestaurants(restaurantGroups).map((restaurant) => (
            <div key={restaurant._id} className={styles.restaurant}>
              <p className={styles.title}>{restaurant.name}</p>

              <div className={styles.items}>
                {restaurant.items.map((item) => (
                  <div key={item._id}>
                    <Link href={`/calendar/${restaurant._id}/${item._id}`}>
                      <a className={styles.item}>
                        <div className={styles.item_details}>
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.description}>
                            {item.description}
                          </p>
                          <p className={styles.price}>USD ${item.price}</p>
                        </div>

                        <div className={styles.item_image}></div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
