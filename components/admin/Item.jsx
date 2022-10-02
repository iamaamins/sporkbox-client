import { useEffect, useState } from "react";
import styles from "@styles/admin/Item.module.css";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Item() {
  const router = useRouter();
  const { restaurants } = useData();
  const [item, setItem] = useState(null);

  // Restaurant and item id
  const itemId = router.query.item;
  const restaurantId = router.query.restaurant;

  useEffect(() => {
    setItem(
      restaurants
        ?.find((restaurant) => restaurant._id === restaurantId)
        .items?.find((item) => item._id === itemId)
    );
  }, [restaurants]);

  return (
    <section className={styles.item}>
      {!item && <h2>No item</h2>}
      {item && (
        <>
          <div className={styles.cover_image}></div>

          <div className={styles.item_details}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.price}>USD ${item.price}</p>
            <p className={styles.tags}>{item.tags}</p>

            <div className={styles.buttons}>
              <Link
                href={`/admin/restaurants/${restaurantId}/${itemId}/edit-item`}
              >
                <a className={styles.edit_item_button}>Edit item</a>
              </Link>

              <button className={styles.remove_item_button}>Remove item</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
