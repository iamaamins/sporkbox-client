import { IActionButton } from "types";
import ButtonLoader from "./ButtonLoader";
import styles from "@styles/layout/ActionButton.module.css";

export default function ActionButton({
  isLoading,
  buttonText,
  handleClick,
}: IActionButton) {
  return (
    <button className={styles.action_button} onClick={handleClick}>
      {isLoading ? <ButtonLoader /> : buttonText}
    </button>
  );
}
