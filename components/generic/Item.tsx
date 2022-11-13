import Image from "next/image";
import { ICartItem, IItem } from "types";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useRouter } from "next/router";
import { useUser } from "@context/User";
import { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import styles from "@styles/generic/Item.module.css";
import {
  expiresIn,
  convertDateToMS,
  formatNumberToUS,
  formatCurrencyToUSD,
} from "@utils/index";

export default function Item() {
  // Initial state
  const initialState = {
    _id: "",
    name: "",
    price: 0,
    quantity: 1,
    expiresIn: 0,
    restaurantId: "",
    deliveryDate: 0,
  };

  // Hooks
  const router = useRouter();
  const { user } = useUser();
  const [item, setItem] = useState<IItem>();
  const { cartItems, addItemToCart } = useCart();
  const { upcomingWeekRestaurants, nextWeekBudget } = useData();
  const [cartItem, setCarItem] = useState<ICartItem>(initialState);

  // Price and quantity
  const { quantity, price } = cartItem;

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (upcomingWeekRestaurants.length > 0 && router.isReady) {
      // Find the restaurant
      const restaurant = upcomingWeekRestaurants.find(
        (upcomingWeekRestaurant) =>
          convertDateToMS(upcomingWeekRestaurant.scheduledOn) ===
            +(router.query.date as string) &&
          upcomingWeekRestaurant._id === router.query.restaurant
      );

      // Find the item
      const item = restaurant?.items.find(
        (item) => item._id === router.query.item
      );

      // If there is a restaurant and an item
      if (restaurant && item) {
        // Update item
        setItem(item);

        // Get the date
        const deliveryDate = convertDateToMS(restaurant.scheduledOn);

        // Update initial item
        setCarItem((currItem) => ({
          ...currItem,
          quantity: 1,
          deliveryDate,
          _id: item._id,
          name: item.name,
          expiresIn: expiresIn,
          restaurantId: restaurant._id,
          price:
            item.price > user?.company?.dailyBudget!
              ? user?.company?.dailyBudget!
              : item.price,
        }));
      }
    }
  }, [upcomingWeekRestaurants, router.isReady]);

  // Increase quantity
  function increaseQuantity() {
    setCarItem((currItem) => ({
      ...currItem,
      quantity: currItem.quantity + 1,
    }));
  }

  // Decrease quantity
  function decreaseQuantity() {
    setCarItem((currItem) => ({
      ...currItem,
      quantity: currItem.quantity - 1,
    }));
  }

  // Get total of any cart items but the current one
  const cartDayTotal = cartItems
    .filter(
      (item) =>
        item.deliveryDate === cartItem.deliveryDate && item._id !== cartItem._id
    )
    .reduce(
      (acc, curr) => formatNumberToUS(acc + curr.price * curr.quantity),
      0
    );

  // Find budget on hand
  const budgetOnHand = nextWeekBudget.find(
    (el) => el.nextWeekDate === cartItem.deliveryDate
  )?.budgetOnHand!;

  // Find if daily budget is exceeded
  const hasExceededDailyBudget =
    formatNumberToUS(budgetOnHand - cartDayTotal - price * quantity) < 0;

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
                className={`${styles.icon} ${
                  quantity === 1 && styles.disabled
                }`}
              >
                <HiMinus />
              </div>
              <p className={styles.item_quantity}>{quantity}</p>
              <div
                onClick={increaseQuantity}
                className={`${styles.icon} ${
                  hasExceededDailyBudget && styles.disabled
                }`}
              >
                <HiPlus />
              </div>
            </div>

            <button
              className={`${styles.button} ${
                hasExceededDailyBudget && styles.disabled
              }`}
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
