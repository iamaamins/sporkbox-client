import Link from "next/link";
import { convertDate, getScheduledRestaurants } from "@utils/index";
import { useData } from "@context/data";
import styles from "@styles/admin/Dashboard.module.css";
import { useEffect, useState } from "react";
import LinkButton from "@components/layout/LinkButton";

export default function Dashboard() {
  const { restaurants, companies } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState(null);

  // Get scheduled restaurants
  useEffect(() => {
    getScheduledRestaurants(restaurants, setScheduledRestaurants);
  }, [restaurants]);

  return (
    <>
      <section className={styles.section}>
        <h2>Current orders</h2>

        {/* Current orders */}
        <div className={styles.orders}>
          {restaurants && (
            <table>
              <thead>
                <tr>
                  <th>Order#</th>
                  <th className={styles.hide_on_mobile}>Created on</th>
                  <th className={styles.hide_on_mobile}>Restaurant</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className={styles.important}>
                      <Link href={`/admin/restaurants/${restaurant._id}`}>
                        <a>{restaurant.name}</a>
                      </Link>
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {restaurant.owner.email}
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {convertDate(restaurant.createdAt)}
                    </td>
                    <td>{restaurant.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Scheduled restaurants */}
      {scheduledRestaurants && (
        <section className={styles.section}>
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

          <LinkButton href="/admin/schedule-restaurants" text="Schedule more" />
        </section>
      )}

      {/* Companies */}
      {companies && companies.length > 0 && (
        <section className={styles.section}>
          <h2>Companies</h2>

          <div className={styles.companies}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className={styles.hide_on_mobile}>Website</th>
                  <th className={styles.hide_on_mobile}>Code</th>
                  <th>Budget</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td className={styles.important}>
                      <Link href={`/admin/companies/${company._id}`}>
                        <a>{company.name}</a>
                      </Link>
                    </td>
                    <td className={styles.hide_on_mobile}>{company.website}</td>
                    <td className={styles.hide_on_mobile}>{company.code}</td>
                    <td>${company.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LinkButton href="/admin/add-company" text="Add company" />
        </section>
      )}
    </>
  );
}
