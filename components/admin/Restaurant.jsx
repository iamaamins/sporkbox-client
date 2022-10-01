import Link from "next/link";
import { useRouter } from "next/router";
import { useRestaurants } from "@context/restaurants";
import styles from "@styles/admin/Restaurant.module.css";
import { useEffect, useState } from "react";

export default function Restaurant() {
  const router = useRouter();
  const { restaurants } = useRestaurants();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (restaurants) {
      setRestaurant(restaurants?.find((data) => data._id === router.query.id));
    }
  }, [restaurants]);

  return (
    <section className={styles.restaurant}>
      {!restaurant && <h2>No restaurant</h2>}
      {restaurant && (
        <>
          <div className={styles.details}>
            <h2>{restaurant.name}</h2>
            <p>
              <span>Owner:</span> {restaurant.owner.name}
            </p>
            <p>
              <span>Email:</span> {restaurant.owner.email}
            </p>

            <p>
              <span>Address:</span> {restaurant.address}
            </p>

            <p>
              <span>Items:</span> Item 1, Item 2
            </p>
          </div>

          <div className={styles.buttons}>
            <Link href={`/admin/restaurants/restaurant-name/add-item`}>
              <a className={styles.add_item}>Add Item</a>
            </Link>

            <button className={styles.block}>
              {restaurant.status === "Pending" ? "Allow" : "Block"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
