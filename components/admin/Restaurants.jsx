import Link from "next/link";
import { createSlug } from "@utils/index";
import styles from "@styles/admin/Restaurants.module.css";

export default function Restaurants() {
  return (
    <section className={styles.section}>
      <h2>All restaurants</h2>

      <div className={`${styles.title} ${styles.restaurants_title}`}>
        <p>Name</p>
        <p className={styles.hide_on_mobile}>Email</p>
        <p className={styles.hide_on_mobile}>Registered</p>
        <p>Status</p>
      </div>

      <div className={styles.restaurants}>
        <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
          <a className={styles.restaurant}>
            <p>Restaurant 1</p>
            <p className={styles.hide_on_mobile}>hello@restaurant1.com</p>
            <p className={styles.hide_on_mobile}>Jun 12, 2022</p>
            <p>Active</p>
          </a>
        </Link>

        <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
          <a className={styles.restaurant}>
            <p>Restaurant 2</p>
            <p className={styles.hide_on_mobile}>hello@restaurant2.com</p>
            <p className={styles.hide_on_mobile}>Aug 25, 2022</p>
            <p>Active</p>
          </a>
        </Link>
      </div>
    </section>
  );
}
