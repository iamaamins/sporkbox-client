import Link from "next/link";
import { convertDate } from "@utils/index";
import styles from "@styles/admin/Restaurants.module.css";
import { useData } from "@context/data";
import LinkButton from "@components/layout/LinkButton";

export default function Restaurants() {
  const { restaurants } = useData();

  return (
    <section className={styles.all_restaurants}>
      {!restaurants && <h2>No restaurants</h2>}
      {restaurants && (
        <>
          <h2 className={styles.all_restaurants_title}>All restaurants</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className={styles.hide_on_mobile}>Email</th>
                <th className={styles.hide_on_mobile}>Registered</th>
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
                    {convertDate(restaurant.createdAt)}{" "}
                  </td>
                  <td>{restaurant.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <LinkButton href="/admin/add-restaurant" text="Add restaurant" />
    </section>
  );
}
