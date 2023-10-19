import Link from 'next/link';
import { LinkButtonProps } from 'types';
import styles from '@styles/layout/LinkButton.module.css';

export default function LinkButton({
  href,
  target,
  linkText,
}: LinkButtonProps) {
  return (
    <Link href={href}>
      <a target={target} className={styles.link_button}>
        {linkText}
      </a>
    </Link>
  );
}
