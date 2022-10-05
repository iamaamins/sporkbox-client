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

          <div className={styles.restaurants}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Scheduled on</th>
                </tr>
              </thead>

              <tbody>
                {scheduledRestaurants.map((scheduledRestaurant) => (
                  <tr key={scheduledRestaurant._id}>
                    <td className={styles.important}>
                      <Link
                        href={`/admin/restaurants/${scheduledRestaurant._id}`}
                      >
                        <a>{scheduledRestaurant.name}</a>
                      </Link>
                    </td>
                    <td>{convertDate(scheduledRestaurant.scheduledOn)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Link href="/admin/schedule-restaurants">
        <a className={styles.button}>Schedule more</a>
      </Link>
    </section>
  );
}
