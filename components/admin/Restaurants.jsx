import Link from "next/link";
import { convertDate } from "@utils/index";
import { useLoader } from "@context/loader";
import { useRestaurants } from "@context/restaurants";
import styles from "@styles/admin/Restaurants.module.css";

export default function Restaurants() {
  const { restaurants } = useRestaurants();

  return (
    <section className={styles.section}>
      {!restaurants && <h2>No restaurants</h2>}
      {restaurants && (
        <>
          <h2>All restaurants</h2>

          <div className={`${styles.title} ${styles.restaurants_title}`}>
            <p>Name</p>
            <p className={styles.hide_on_mobile}>Email</p>
            <p className={styles.hide_on_mobile}>Registered</p>
            <p>Status</p>
          </div>

          <div className={styles.restaurants}>
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className={styles.restaurant}>
                <Link href={`/admin/restaurants/${restaurant._id}`}>
                  <a>
                    <p>{restaurant.name}</p>
                    <p className={styles.hide_on_mobile}>
                      {restaurant.owner.email}
                    </p>
                    <p className={styles.hide_on_mobile}>
                      {convertDate(restaurant.createdAt)}
                    </p>
                    <p>{restaurant.status}</p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      <Link href="/admin/add-restaurant">
        <a className={styles.button}>Add restaurant</a>
      </Link>
    </section>
  );
}
