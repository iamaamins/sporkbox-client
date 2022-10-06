import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import styles from "@styles/admin/Item.module.css";
import { updateRestaurants } from "@utils/index";

export default function Item() {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const { restaurants, setRestaurants } = useData();

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

  // Handle delete
  async function handleDelete() {
    // Delete an item
    try {
      // Send the request to backend
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}/${itemId}/delete-item`,
        { withCredentials: true }
      );

      // Updated restaurants array with updated items
      updateRestaurants(res, "items", setRestaurants);

      // Bck to the restaurant page
      router.back();
    } catch (err) {
      console.log(err);
    }
  }

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
                <a className={styles.edit_button}>Edit item</a>
              </Link>

              <button onClick={handleDelete} className={styles.delete_button}>
                Delete item
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
