import ButtonLoader from './ButtonLoader';
import { SubmitButtonProps } from 'types';
import styles from '@styles/layout/SubmitButton.module.css';

export default function SubmitButton({ text, isLoading }: SubmitButtonProps) {
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
