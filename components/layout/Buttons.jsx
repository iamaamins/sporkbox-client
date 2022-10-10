import Link from "next/link";
import styles from "@styles/layout/Buttons.module.css";

export default function Buttons({
  handleClick,
  linkText,
  buttonText,
  status,
  href,
}) {
  return (
    <div className={styles.buttons}>
      <Link href={href}>
        <a className={styles.link_button}>{linkText}</a>
      </Link>

      <button onClick={handleClick} className={styles.action_button}>
        {status ? (status === "PENDING" ? "Approve" : "Restrict") : buttonText}
      </button>
    </div>
  );
}
