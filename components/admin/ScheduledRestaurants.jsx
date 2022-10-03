import { useData } from "@context/data";
import { convertDate } from "@utils/index";
import { useEffect, useState } from "react";
import styles from "@styles/admin/ScheduledRestaurants.module.css";
import Link from "next/link";

export default function ScheduledRestaurants() {
  const { restaurants } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState([]);

  // Get the scheduled restaurants
  useEffect(() => {
    if (restaurants) {
      setScheduledRestaurants(
        restaurants
          .filter((restaurant) => restaurant.status === "APPROVED")
          .filter(
            (approvedRestaurant) =>
              new Date(approvedRestaurant.scheduledAt).getTime() >
              new Date().getTime()
          )
      );
    }
  }, [restaurants]);

  return (
    <section className={styles.scheduled_restaurants}>
      {scheduledRestaurants.length === 0 && <h2>No scheduled restaurants</h2>}

      {scheduledRestaurants.length > 0 && (
        <>
          <h2>Scheduled restaurants</h2>

          <div className={`${styles.title} ${styles.restaurants_title}`}>
            <p>Name</p>
            <p>Scheduled at</p>
          </div>

          <div className={styles.restaurants}>
            {scheduledRestaurants.map((scheduledRestaurant) => (
              <div key={scheduledRestaurant._id} className={styles.restaurant}>
                <p>{scheduledRestaurant.name}</p>
                <p>{convertDate(scheduledRestaurant.scheduledAt)}</p>
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
