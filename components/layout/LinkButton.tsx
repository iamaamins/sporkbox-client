import Link from 'next/link';
import { ILinkButtonProps } from 'types';
import styles from './LinkButton.module.css';

export default function LinkButton({
  href,
  target,
  linkText,
}: ILinkButtonProps) {
  return (
    <Link href={href}>
      <a target={target} className={styles.link_button}>
        {linkText}
      </a>
    </Link>
  );
}
