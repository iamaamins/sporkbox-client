import Link from 'next/link';
import { BsHandbag } from 'react-icons/bs';
import styles from './CartIcon.module.css';

type Props = {
  totalCartQuantity: number;
};

export default function CartIcon({ totalCartQuantity }: Props) {
  return (
    <Link href='/cart'>
      <a className={styles.container}>
        <BsHandbag />
        {totalCartQuantity > 0 && (
          <span className={styles.quantity}>{totalCartQuantity}</span>
        )}
      </a>
    </Link>
  );
}
