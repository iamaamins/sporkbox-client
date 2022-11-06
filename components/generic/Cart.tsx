import Image from "next/image";
import Link from "next/link";
import { useUser } from "@context/User";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { IoMdRemove } from "react-icons/io";
import { useEffect, useState } from "react";
import styles from "@styles/generic/Cart.module.css";
import ButtonLoader from "@components/layout/ButtonLoader";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

export default function Cart() {
  // Hooks
  const { user } = useUser();
  const { isDataLoading, customerActiveOrdersTotal } = useData();
  const {
    cartItems,
    isLoading,
    checkoutCart,
    totalCartPrice,
    removeItemFromCart,
  } = useCart();
  const [budgetExceeded, setBudgetExceeded] = useState(false);

  // Check if budget is exceeded
  useEffect(() => {
    if (user && !isDataLoading) {
      setBudgetExceeded(
        customerActiveOrdersTotal + totalCartPrice > user.company?.budget!
      );
    }
  }, [user, cartItems, isDataLoading]);

  return (
    <section className={styles.cart}>
      {cartItems.length === 0 && <h2>No items in basket</h2>}

      {cartItems.length > 0 && (
        <>
          <h2 className={styles.cart_title}>Your basket</h2>
          <div className={styles.items}>
            {cartItems.map((cartItem) => (
              <div key={cartItem._id} className={styles.item}>
                <div className={styles.cover_image}>
                  <Image
                    src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                    height={2}
                    width={3}
                    layout="responsive"
                    objectFit="cover"
                  />

                  <div
                    className={styles.remove}
                    onClick={() => removeItemFromCart(cartItem._id)}
                  >
                    <IoMdRemove />
                  </div>
                </div>

                <Link
                  href={`/calendar/${cartItem.deliveryDate}/${cartItem.restaurantId}/${cartItem._id}`}
                >
                  <a className={styles.item_details}>
                    <p className={styles.name}>
                      <span>{cartItem.quantity}</span> {cartItem.name}
                    </p>
                    <p className={styles.price}>
                      Total: {formatCurrencyToUSD(cartItem.total)}
                    </p>
                    <p className={styles.date}>
                      Delivery date:{" "}
                      <span>{convertDateToText(cartItem.deliveryDate)}</span>
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>

          {budgetExceeded && (
            <p className={styles.budget_exceeded}>
              Company budget exceeded! Please adjust your basket.
            </p>
          )}

          <button
            onClick={checkoutCart}
            className={`${styles.button} ${budgetExceeded && styles.disable}`}
          >
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
