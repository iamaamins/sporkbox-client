import Link from "next/link";
import styles from "@styles/layout/LinkButton.module.css";

export default function LinkButton({ href, text }) {
  return (
    <Link href={href}>
      <a className={styles.link_button}>{text}</a>
    </Link>
  );
}
