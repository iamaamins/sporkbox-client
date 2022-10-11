import Link from "next/link";
import { useData } from "@context/data";
import { convertDate } from "@utils/index";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/ScheduledRestaurants.module.css";

export default function ScheduledRestaurants() {
  const { scheduledRestaurants } = useData();

  return (
    <section className={styles.scheduled_restaurants}>
      {scheduledRestaurants.length === 0 && <h2>No scheduled restaurants</h2>}

      {scheduledRestaurants.length > 0 && (
        <>
          <h2>Scheduled restaurants</h2>

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
                      <Link href={`/admin/vendors/${scheduledRestaurant._id}`}>
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

      <LinkButton href="/admin/schedule-restaurants" text="Schedule more" />
    </section>
  );
}
