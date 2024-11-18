import Link from 'next/link';
import { BsHandbag } from 'react-icons/bs';
import styles from './CartIcon.module.css';

type Props = {
  href: string;
  totalCartQuantity: number;
};

export default function CartIcon({ href, totalCartQuantity }: Props) {
  return (
    <Link href={href}>
      <a className={styles.container}>
        <BsHandbag />
        {totalCartQuantity > 0 && (
          <span className={styles.quantity}>{totalCartQuantity}</span>
        )}
      </a>
    </Link>
  );
}
