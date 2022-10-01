import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL, convertDate } from "@utils/index";
import styles from "@styles/admin/Restaurants.module.css";

export default function Restaurants() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState(null);

  // Get all restaurants
  useEffect(() => {
    async function getRestaurants() {
      try {
        // Show loader
        setIsLoading(true);

        // Request the data
        const res = await axios.get(`${API_URL}/restaurant`, {
          withCredentials: true,
        });

        // Update state
        setRestaurants(res.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }

    // Call the functions
    getRestaurants();
  }, [router.isReady]);

  return (
    <section className={styles.section}>
      {isLoading && <h1>Loading....</h1>}
      {!isLoading && !restaurants && <h2>No restaurants</h2>}
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
