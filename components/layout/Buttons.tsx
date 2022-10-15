import Link from "next/link";
import { IButtons } from "types";
import styles from "@styles/layout/Buttons.module.css";

export default function Buttons({
  handleClick,
  linkText,
  buttonText,
  href,
}: IButtons) {
  return (
    <div className={styles.buttons}>
      <Link href={href}>
        <a className={styles.link_button}>{linkText}</a>
      </Link>

      <button onClick={handleClick} className={styles.action_button}>
        {buttonText}
      </button>
    </div>
  );
}
