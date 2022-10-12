import Link from "next/link";
import { useCart } from "@context/Cart";
import { BsHandbag } from "react-icons/bs";
import styles from "@styles/layout/CartIcon.module.css";

export default function CartIcon() {
  const { totalCartQuantity } = useCart();

  return (
    <Link href="/cart">
      <a className={styles.cart}>
        <BsHandbag />

        {totalCartQuantity > 0 && (
          <span className={styles.quantity}>{totalCartQuantity}</span>
        )}
      </a>
    </Link>
  );
}
