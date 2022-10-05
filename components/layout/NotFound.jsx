import Link from "next/link";
import { TbUnlink } from "react-icons/tb";
import styles from "@styles/layout/NotFound.module.css";

export default function NotFound() {
  return (
    <section className={styles.not_found}>
      <div className={styles.broken_link}>
        <TbUnlink />
      </div>

      <h2>This page isn't available</h2>

      <p>
        This is maybe a broken link or the page have been removed. Please check
        to see the link you are trying to open is correct.
      </p>

      <Link href="/">
        <a className={styles.go_home_button}>Go home</a>
      </Link>
    </section>
  );
}
