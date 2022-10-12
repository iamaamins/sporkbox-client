import ButtonLoader from "./ButtonLoader";
import { IActionButtonProps } from "types";
import styles from "@styles/layout/ActionButton.module.css";

export default function ActionButton({
  text,
  isLoading,
  isDisabled,
}: IActionButtonProps) {
  return (
    <button
      type="submit"
      className={`${styles.action_button} 
      ${!isDisabled && styles.active}`}
    >
      {isLoading ? <ButtonLoader /> : text}
    </button>
  );
}
