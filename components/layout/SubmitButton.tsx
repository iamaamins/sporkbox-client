import ButtonLoader from "./ButtonLoader";
import { ISubmitButtonProps } from "types";
import styles from "@styles/layout/SubmitButton.module.css";

export default function SubmitButton({
  text,
  isLoading,
  isDisabled,
}: ISubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`${styles.submit_button} 
      ${!isDisabled && styles.active}`}
    >
      {isLoading ? <ButtonLoader /> : text}
    </button>
  );
}
