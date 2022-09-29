import Link from "next/link";
import { createSlug } from "@utils/index";
import styles from "@styles/admin/Companies.module.css";

export default function Companies() {
  return (
    <section className={styles.section}>
      <h2>All companies</h2>

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
    </section>
  );
}
