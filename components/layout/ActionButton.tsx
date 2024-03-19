import ButtonLoader from './ButtonLoader';
import styles from './ActionButton.module.css';

type Props = {
  isLoading: boolean;
  buttonText: string;
  handleClick: () => Promise<void>;
};

export default function ActionButton({
  isLoading,
  buttonText,
  handleClick,
}: Props) {
  return (
    <button className={styles.action_button} onClick={handleClick}>
      {isLoading ? <ButtonLoader /> : buttonText}
    </button>
  );
}
