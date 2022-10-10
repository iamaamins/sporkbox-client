import Image from "next/image";
import Link from "next/link";
import { useCart } from "@context/cart";
import { convertDate } from "@utils/index";
import { IoMdRemove } from "react-icons/io";
import styles from "@styles/generic/Cart.module.css";

export default function Cart() {
  const { cartItems } = useCart();

  return (
    <section className={styles.cart}>
      {cartItems.length === 0 && <h2>No items in basket</h2>}

      <>
        <h2 className={styles.cart_title}>Your basket</h2>
        {cartItems.length > 0 && (
          <div className={styles.items}>
            {cartItems.map((cartItem) => (
              <Link
                href={`/calendar/${cartItem.date}/${cartItem.restaurant}/${cartItem.id}`}
              >
                <a className={styles.item}>
                  <div className={styles.cover_image}>
                    <Image
                      src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                      height={2}
                      width={3}
                      layout="responsive"
                      objectFit="cover"
                    />

                    <div className={styles.remove}>
                      <IoMdRemove />
                    </div>
                  </div>

                  <div className={styles.item_details}>
                    <p className={styles.name}>
                      <span>{cartItem.quantity}</span> {cartItem.name}
                    </p>
                    <p className={styles.price}>Total: ${cartItem.total}</p>
                    <p className={styles.date}>
                      Delivery date: <span>{convertDate(+cartItem.date)}</span>
                    </p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </>

      <button className={styles.button}>Checkout</button>
    </section>
  );
}
