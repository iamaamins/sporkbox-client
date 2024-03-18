import Link from 'next/link';
import { IButtons } from 'types';
import styles from './Buttons.module.css';

export default function Buttons({
  href,
  linkText,
  buttonText,
  initiateStatusUpdate,
}: IButtons) {
  return (
    <div className={styles.buttons}>
      <Link href={href}>
        <a className={styles.link_button}>{linkText}</a>
      </Link>

      <button className={styles.action_button} onClick={initiateStatusUpdate}>
        {buttonText}
      </button>
    </div>
  );
}
