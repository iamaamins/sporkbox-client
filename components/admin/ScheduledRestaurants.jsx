import { useData } from "@context/data";
import { convertDate, getScheduledRestaurants } from "@utils/index";
import { useEffect, useState } from "react";
import styles from "@styles/admin/ScheduledRestaurants.module.css";
import Link from "next/link";

export default function ScheduledRestaurants() {
  const { restaurants } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState(null);

  // Get the scheduled restaurants
  useEffect(() => {
    getScheduledRestaurants(restaurants, setScheduledRestaurants);
  }, [restaurants]);

  return (
    <section className={styles.scheduled_restaurants}>
      {!scheduledRestaurants && <h2>No scheduled restaurants</h2>}

      {scheduledRestaurants && (
        <>
          <h2 className={styles.scheduled_restaurants_title}>
            Scheduled restaurants
          </h2>

          <div className={`${styles.title} ${styles.restaurants_title}`}>
            <p>Name</p>
            <p>Scheduled on</p>
          </div>

          <div className={styles.restaurants}>
            {scheduledRestaurants.map((scheduledRestaurant) => (
              <div key={scheduledRestaurant._id} className={styles.restaurant}>
                <p>{scheduledRestaurant.name}</p>
                <p>{convertDate(scheduledRestaurant.scheduledOn)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <Link href="/admin/schedule-restaurants">
        <a className={styles.button}>Schedule more</a>
      </Link>
    </section>
  );
}
