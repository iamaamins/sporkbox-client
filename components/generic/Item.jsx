import Link from "next/link";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import styles from "@styles/generic/Item.module.css";

export default function Item() {
  const router = useRouter();
  const { restaurants } = useData();
  const [item, setItem] = useState(null);

  useEffect(() => {
    setItem(
      restaurants
        ?.find((restaurant) => restaurant._id === router.query.restaurant)
        .items?.find((item) => item._id === router.query.item)
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
                href={`/admin/restaurants/${router.query.restaurant}/${router.query.item}/edit-item`}
              >
                <a className={styles.edit_button}>Edit item</a>
              </Link>

              <button className={styles.delete_button}>Delete item</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
