import Image from "next/image";
import { ICartItem, IItem } from "types";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import styles from "@styles/generic/Item.module.css";
import {
  convertDateToMilliseconds,
  formatCurrencyToUSD,
  formatNumberToUS,
} from "@utils/index";

export default function Item() {
  // Initial state
  const initialState = {
    _id: "",
    date: 0,
    name: "",
    price: 0,
    total: 0,
    quantity: 1,
    restaurant: "",
  };
  const router = useRouter();
  const { addItemToCart } = useCart();
  const { scheduledRestaurants } = useData();
  const [item, setItem] = useState<IItem>();
  const [cartItem, setCarItem] = useState<ICartItem>(initialState);

  // Price and quantity
  const { quantity, price } = cartItem;

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (scheduledRestaurants.length > 0 && router.isReady) {
      // Find the restaurant
      const restaurant = scheduledRestaurants.find(
        (scheduledRestaurant) =>
          scheduledRestaurant._id === router.query.restaurant
      );

      // Find the item
      const item = restaurant?.items.find(
        (item) => item._id === router.query.item
      );

      // If there are restaurant and item
      if (restaurant && item) {
        // Update item
        setItem(item);

        // Get the date
        const date = convertDateToMilliseconds(restaurant?.scheduledOn);

        // Update initial item
        setCarItem((currItem) => ({
          ...currItem,
          date,
          quantity: 1,
          _id: item._id,
          name: item.name,
          price: item.price,
          total: item.price,
          restaurant: router.query.restaurant as string,
        }));
      }
    }
  }, [scheduledRestaurants, router.isReady]);

  // Increase quantity
  function increaseQuantity() {
    setCarItem((currItem) => ({
      ...currItem,
      quantity: currItem.quantity + 1,
      total: formatNumberToUS(currItem.price * (currItem.quantity + 1)),
    }));
  }

  // Decrease quantity
  function decreaseQuantity() {
    setCarItem((currItem) => ({
      ...currItem,
      quantity: currItem.quantity - 1,
      total: formatNumberToUS(currItem.price * (currItem.quantity - 1)),
    }));
  }

  return (
    <section className={styles.item}>
      {!item && <h2>No item</h2>}

      {item && (
        <>
          <div className={styles.cover_image}>
            <Image
              src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              height={2}
              width={3}
              layout="responsive"
              objectFit="cover"
            />
          </div>

          <div className={styles.details_controller_and_button}>
            <div className={styles.item_details}>
              <p className={styles.item_name}>{item.name}</p>
              <p className={styles.item_description}>{item.description}</p>
              <p className={styles.tags}>
                {item.tags.split(",").map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </p>
            </div>

            <div className={styles.controller}>
              <div
                onClick={decreaseQuantity}
                className={`${styles.minus} ${styles.icon} ${
                  quantity > 1 && styles.active
                }`}
              >
                <HiMinus />
              </div>
              <p className={styles.item_quantity}>{quantity}</p>
              <div
                onClick={increaseQuantity}
                className={`${styles.plus} ${styles.icon}`}
              >
                <HiPlus />
              </div>
            </div>

            <button
              className={styles.button}
              onClick={() => addItemToCart(cartItem)}
            >
              Add {quantity} to basket • {formatCurrencyToUSD(quantity * price)}{" "}
              USD
            </button>
          </div>
        </>
      )}
    </section>
  );
}