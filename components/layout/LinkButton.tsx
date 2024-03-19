import Link from 'next/link';
import styles from './LinkButton.module.css';

type Props = {
  href: string;
  target?: string;
  linkText: string;
};

export default function LinkButton({ href, target, linkText }: Props) {
  return (
    <Link href={href}>
      <a target={target} className={styles.link_button}>
        {linkText}
      </a>
    </Link>
  );
}
