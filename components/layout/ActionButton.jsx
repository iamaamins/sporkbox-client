import ButtonLoader from "./ButtonLoader";
import styles from "@styles/layout/ActionButton.module.css";

export default function ActionButton({ text, isLoading, isDisabled }) {
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
