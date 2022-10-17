import styles from "@styles/layout/ActionButton.module.css";
import { IActionButton } from "types";

export default function ActionButton({
  buttonText,
  handleClick,
}: IActionButton) {
  return (
    <button className={styles.action_button} onClick={handleClick}>
      {buttonText}
    </button>
  );
}
