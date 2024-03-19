import Link from 'next/link';
import styles from './Buttons.module.css';
import { FormEvent } from 'react';

type Props = {
  href: string;
  linkText: string;
  buttonText: string;
  initiateStatusUpdate: (e: FormEvent) => void;
};

export default function Buttons({
  href,
  linkText,
  buttonText,
  initiateStatusUpdate,
}: Props) {
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
