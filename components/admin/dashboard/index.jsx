import styles from "@styles/admin/dashboard/Dashboard.module.css";
import { createSlug } from "@utils/index";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <section className={styles.section}>
        <h2>Current orders</h2>

        <div className={`${styles.title} ${styles.orders_title}`}>
          <p>Order</p>
          <p>Date</p>
          <p>Status</p>
          <p>Total</p>
          <p>Restaurant</p>
        </div>

        <div className={styles.orders}>
          <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Order 1</p>
              <p>Processing</p>
              <p>Restaurant 1</p>
            </a>
          </Link>

          <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Order 2</p>
              <p>Processing</p>
              <p>Restaurant 2</p>
            </a>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Restaurants</h2>

        <div className={`${styles.title} ${styles.restaurants_title}`}>
          <p>Name</p>
          <p>Email</p>
          <p>Registered</p>
          <p>Status</p>
        </div>

        <div className={styles.restaurants}>
          <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
            <a className={styles.restaurant}>
              <p>Restaurant 1</p>
              <p>Active</p>
            </a>
          </Link>

          <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
            <a className={styles.restaurant}>
              <p>Restaurant 2</p>
              <p>Active</p>
            </a>
          </Link>
        </div>

        <button>Add restaurant</button>
      </section>

      <section className={styles.section}>
        <h2>Companies</h2>

        <div className={`${styles.title} ${styles.companies_title}`}>
          <p>Name</p>
          <p>Budget</p>
        </div>

        <div className={styles.companies}>
          <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
            <a className={styles.company}>
              <p>Company 1</p>
              <p>$140</p>
            </a>
          </Link>

          <Link href={`/admin/restaurants/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Company 2</p>
              <p>$180</p>
            </a>
          </Link>
        </div>

        <button>Add company</button>
      </section>
    </>
  );
}
