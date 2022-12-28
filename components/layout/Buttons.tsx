import Link from "next/link";
import { IButtons } from "types";
import styles from "@styles/layout/Buttons.module.css";

export default function Buttons({
  href,
  linkText,
  buttonText,
  handleClick,
  handleArchive,
}: IButtons) {
  return (
    <div className={styles.buttons}>
      <Link href={href}>
        <a className={styles.link_button}>{linkText}</a>
      </Link>

      <button
        className={styles.action_button}
        onClick={handleClick || handleArchive}
      >
        {buttonText}
      </button>
    </div>
  );
}
