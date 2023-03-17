import Image from "next/image";
import Link from "next/link";
import { useCart } from "@context/Cart";
import { IoMdRemove } from "react-icons/io";
import styles from "@styles/generic/Cart.module.css";
import ButtonLoader from "@components/layout/ButtonLoader";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

export default function Cart() {
  // Hooks
  const {
    cartItems,
    isLoading,
    checkoutCart,
    totalCartPrice,
    removeItemFromCart,
  } = useCart();

  return (
    <section className={styles.cart}>
      {cartItems.length === 0 && <h2>No items in basket</h2>}

      {cartItems.length > 0 && (
        <>
          <h2 className={styles.cart_title}>Your basket</h2>
          <div className={styles.items}>
            {cartItems.map((cartItem, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.cover_image}>
                  <Image
                    src={cartItem.image}
                    height={2}
                    width={3}
                    layout="responsive"
                    objectFit="cover"
                  />

                  <div
                    className={styles.remove}
                    onClick={() => removeItemFromCart(cartItem)}
                  >
                    <IoMdRemove />
                  </div>
                </div>

                <Link
                  href={`/place-order/${cartItem.deliveryDate}/${cartItem.shift}/${cartItem.restaurantId}/${cartItem._id}`}
                >
                  <a className={styles.item_details}>
                    <p className={styles.name}>
                      <span>{cartItem.quantity}</span> {cartItem.name}
                    </p>
                    <p className={styles.price}>
                      Total:{" "}
                      {formatCurrencyToUSD(
                        cartItem.price * cartItem.quantity + cartItem.addonPrice
                      )}
                    </p>
                    <p className={styles.date}>
                      Delivery date:{" "}
                      <span>{convertDateToText(cartItem.deliveryDate)}</span> -{" "}
                      <span className={styles.shift}>{cartItem.shift}</span>
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>

          <button onClick={checkoutCart} className={`${styles.button}`}>
            {isLoading ? (
              <ButtonLoader />
            ) : (
              `Checkout • ${formatCurrencyToUSD(totalCartPrice)} USD`
            )}
          </button>
        </>
      )}
    </section>
  );
}
