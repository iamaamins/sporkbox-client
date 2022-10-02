import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import styles from "@styles/admin/Restaurant.module.css";

export default function Restaurant() {
  const router = useRouter();
  const { restaurants } = useData();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    setRestaurant(restaurants?.find((data) => data._id === router.query.id));
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

            <div className={styles.buttons}>
              <Link href={`/admin/restaurants/${restaurant._id}/add-item`}>
                <a className={styles.add_item}>Add Item</a>
              </Link>

              <button className={styles.block}>
                {restaurant.status === "Pending" ? "Allow" : "Block"}
              </button>
            </div>

            {restaurant.items.length > 0 && (
              <div className={styles.items}>
                <h2>Items</h2>
                {restaurant.items.map((item) => (
                  <div>
                    <p>Name: {item.name}</p>
                    <p>Description: {item.description}</p>
                    <p>Price: {item.price}</p>
                    <p>Tags: {item.tags}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
