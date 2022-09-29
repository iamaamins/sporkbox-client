import styles from "@styles/admin/Dashboard.module.css";
import { createSlug } from "@utils/index";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <section className={styles.section}>
        <h2>Current orders</h2>

        <div className={`${styles.title} ${styles.orders_title}`}>
          <p>Order</p>
          <p className={styles.hide_on_mobile}>Date</p>
          <p>Status</p>
          <p className={styles.hide_on_mobile}>Total</p>
          <p>Restaurant</p>
        </div>

        <div className={styles.orders}>
          <Link href={`/admin/all-orders/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Order 1</p>
              <p className={styles.hide_on_mobile}>Sep 28, 2022</p>
              <p className={styles.gray}>Processing</p>
              <p className={styles.hide_on_mobile}>$140</p>
              <p>Restaurant 1</p>
            </a>
          </Link>

          <Link href={`/admin/all-orders/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Order 2</p>
              <p className={styles.hide_on_mobile}>Sep 30, 2022</p>
              <p>Processing</p>
              <p className={styles.hide_on_mobile}>$180</p>
              <p>Restaurant 2</p>
            </a>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Restaurants</h2>

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

        <Link href="/admin/add-restaurant">
          <a className={styles.button}>Add restaurant</a>
        </Link>
      </section>

      <section className={styles.section}>
        <h2>Companies</h2>

        <div className={`${styles.title} ${styles.companies_title}`}>
          <p>Name</p>
          <p className={styles.hide_on_mobile}>Code</p>
          <p>Budget</p>
        </div>

        <div className={styles.companies}>
          <Link href={`/admin/companies/${createSlug("restaurant-name")}`}>
            <a className={styles.company}>
              <p>Company 1</p>
              <p className={styles.hide_on_mobile}>company1</p>
              <p>$140</p>
            </a>
          </Link>

          <Link href={`/admin/companies/${createSlug("restaurant-name")}`}>
            <a className={styles.company}>
              <p>Company 2</p>
              <p className={styles.hide_on_mobile}>company2</p>
              <p>$180</p>
            </a>
          </Link>
        </div>

        <Link href="/admin/add-company">
          <a className={styles.button}>Add company</a>
        </Link>
      </section>
    </>
  );
}
