import Link from "next/link";
import { createSlug } from "@utils/index";
import styles from "@styles/admin/Orders.module.css";

export default function Orders() {
  return (
    <section className={styles.section}>
      <h2>All orders</h2>

      <div className={`${styles.title} ${styles.orders_title}`}>
        <p>Order</p>
        <p className={styles.hide_on_mobile}>Date</p>
        <p>Status</p>
        <p className={styles.hide_on_mobile}>Total</p>
        <p>Restaurant</p>
      </div>

      <div className={styles.orders}>
        <Link href={`/admin/orders/${createSlug("restaurant-name")}`}>
          <a className={styles.order}>
            <p>Order 1</p>
            <p className={styles.hide_on_mobile}>Sep 28, 2022</p>
            <p className={styles.gray}>Processing</p>
            <p className={styles.hide_on_mobile}>$140</p>
            <p>Restaurant 1</p>
          </a>
        </Link>

        <Link href={`/admin/orders/${createSlug("restaurant-name")}`}>
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
  );
}
