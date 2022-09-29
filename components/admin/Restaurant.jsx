import styles from "@styles/admin/Restaurant.module.css";
import Link from "next/link";

export default function Restaurant() {
  return (
    <section className={styles.restaurant}>
      <div className={styles.details}>
        <h2>Restaurant 1</h2>
        <p>
          <span>Owner:</span> Owner name
        </p>
        <p>
          <span>Email:</span> hello@restaurant1.com
        </p>

        <p>
          <span>Phone:</span> 123-456-6789
        </p>

        <p>
          <span>Address:</span> Test address
        </p>

        <p>
          <span>Items:</span> Item 1, Item 2
        </p>
      </div>

      <div className={styles.buttons}>
        <Link href={`/admin/restaurants/restaurant-name/add-item`}>
          <a className={styles.add_item}>Add Item</a>
        </Link>

        <button className={styles.block}>Block</button>
      </div>
    </section>
  );
}
