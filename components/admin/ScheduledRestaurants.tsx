import Link from "next/link";
import { useData } from "@context/Data";
import { convertDateToText } from "@utils/index";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/ScheduledRestaurants.module.css";

export default function ScheduledRestaurants() {
  const { scheduledRestaurants } = useData();

  return (
    <section className={styles.scheduled_restaurants}>
      {scheduledRestaurants.isLoading && <h2>Loading...</h2>}

      {!scheduledRestaurants.isLoading &&
        scheduledRestaurants.data.length === 0 && (
          <h2>No scheduled restaurants</h2>
        )}

      {scheduledRestaurants.data.length > 0 && (
        <>
          <h2>Scheduled restaurants</h2>

          <div className={styles.restaurants}>
            <table>
              <thead>
                <tr>
                  <th>Scheduled on</th>
                  <th>Restaurant</th>
                  <th>Company</th>
                </tr>
              </thead>

              <tbody>
                {scheduledRestaurants.data.map((scheduledRestaurant, index) => (
                  <tr key={index}>
                    <td className={styles.important}>
                      <Link
                        href={`/admin/restaurants/${scheduledRestaurant._id}`}
                      >
                        <a>{convertDateToText(scheduledRestaurant.date)}</a>
                      </Link>
                    </td>
                    <td>{scheduledRestaurant.name}</td>
                    <td>{scheduledRestaurant.company.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
