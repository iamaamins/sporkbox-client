import ButtonLoader from './ButtonLoader';
import styles from './SubmitButton.module.css';

type Props = { text: string; isLoading: boolean };

export default function SubmitButton({ text, isLoading }: Props) {
  return (
    <button
      type='submit'
      className={`${styles.submit_button} 
      ${isLoading && styles.disabled}`}
    >
      {isLoading ? <ButtonLoader /> : text}
    </button>
  );
}
