import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { convertDateToTime, groupBy } from "@utils/index";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  const router = useRouter();
  const { scheduledRestaurants } = useData();
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantGroups, setRestaurantGroups] = useState([]);

  useEffect(() => {
    if (router.isReady && scheduledRestaurants) {
      // Groups restaurants by scheduled on date
      const groups = groupBy(
        "scheduledOn",
        scheduledRestaurants,
        "restaurants"
      );

      // Find the restaurant with date from slug
      const restaurants = groups.find(
        (group) =>
          convertDateToTime(group.scheduledOn).toString() === router.query.date
      ).restaurants;

      // Update restaurants
      setRestaurants(restaurants);

      // Update groups
      setRestaurantGroups(groups);
    }
  }, [scheduledRestaurants, router]);

  // Get the date
  const getDate = (date) =>
    new Date(date).toDateString().split(" ").slice(2, 3).join();

  // Get the first letter of the day
  const getDay = (date) =>
    new Date(date).toDateString().split(" ").slice(0, 1)[0].split("")[0];

  return (
    <section className={styles.calendar}>
      {restaurantGroups.length === 0 && <h2>No restaurants</h2>}

      {restaurantGroups.length > 0 && (
        <>
          <div className={styles.title_and_controller}>
            <h2 className={styles.calendar_title}>Upcoming week</h2>

            <div className={styles.controller}>
              {restaurantGroups.map((restaurantGroup) => (
                <Link
                  href={`/calendar/${convertDateToTime(
                    restaurantGroup.scheduledOn
                  )}`}
                >
                  <a key={restaurantGroup.scheduledOn}>
                    <span>{getDate(restaurantGroup.scheduledOn)}</span>
                    <span>{getDay(restaurantGroup.scheduledOn)}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {restaurants.map((restaurant) => (
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
