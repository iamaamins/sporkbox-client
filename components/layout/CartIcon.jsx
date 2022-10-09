import { useCart } from "@context/cart";
import { BsHandbag } from "react-icons/bs";
import styles from "@styles/layout/CartIcon.module.css";

export default function CartIcon() {
  const { totalCartQuantity } = useCart();

  return (
    <div className={styles.cart}>
      <BsHandbag />
      {totalCartQuantity > 0 && (
        <span className={styles.quantity}>{totalCartQuantity}</span>
      )}
    </div>
  );
}
