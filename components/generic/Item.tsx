import Image from "next/image";
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
  convertDateToText,
} from "@utils/index";
import { ICartItem, IItem, IUpcomingWeekRestaurant } from "types";

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
  const [cartItem, setCarItem] = useState<ICartItem>(initialState);
  const { upcomingWeekRestaurants, nextWeekBudgetAndDates } = useData();
  const [upcomingWeekRestaurant, setUpcomingWeekRestaurant] =
    useState<IUpcomingWeekRestaurant>();

  // Price and quantity
  const { quantity, price } = cartItem;

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (upcomingWeekRestaurants.data.length > 0 && router.isReady) {
      // Find the restaurant
      const upcomingWeekRestaurant = upcomingWeekRestaurants.data.find(
        (upcomingWeekRestaurant) =>
          convertDateToMS(upcomingWeekRestaurant.date) ===
            +(router.query.date as string) &&
          upcomingWeekRestaurant._id === router.query.restaurant
      );

      if (upcomingWeekRestaurant) {
        // Update state
        setUpcomingWeekRestaurant(upcomingWeekRestaurant);

        // Find the item
        const item = upcomingWeekRestaurant.items.find(
          (item) => item._id === router.query.item
        );

        if (item) {
          // Update item
          setItem(item);

          // Get the date
          const deliveryDate = convertDateToMS(upcomingWeekRestaurant.date);

          // Update initial item
          setCarItem((currItem) => ({
            ...currItem,
            quantity: 1,
            deliveryDate,
            _id: item._id,
            name: item.name,
            expiresIn: expiresIn,
            restaurantId: upcomingWeekRestaurant._id,
            price:
              item.price > user?.company?.dailyBudget!
                ? user?.company?.dailyBudget!
                : item.price,
          }));
        }
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
      (acc, item) => formatNumberToUS(acc + item.price * item.quantity),
      0
    );

  // Find budget on hand
  const budgetOnHand = nextWeekBudgetAndDates.find(
    (nextWeekBudgetAndDate) =>
      nextWeekBudgetAndDate.nextWeekDate === cartItem.deliveryDate
  )?.budgetOnHand!;

  // Find if daily budget is exceeded
  const hasExceededDailyBudget =
    formatNumberToUS(budgetOnHand - cartDayTotal - price * quantity) < 0;

  return (
    <section className={styles.item}>
      {upcomingWeekRestaurants.isLoading && <h2>Loading...</h2>}

      {!upcomingWeekRestaurants.isLoading && !item && <h2>No item found</h2>}

      {upcomingWeekRestaurant && item && (
        <>
          <div className={styles.cover_image}>
            <Image
              src={item.image || upcomingWeekRestaurant.logo}
              width={16}
              height={10}
              layout="responsive"
              objectFit="cover"
            />
          </div>
          <div className={styles.details_controller_and_button}>
            <div className={styles.item_details}>
              <p className={styles.item_name}>
                {item.name} - {formatCurrencyToUSD(item.price)}
              </p>
              <p className={styles.item_description}>{item.description}</p>
              <p className={styles.tags}>
                {item.tags.split(",").map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </p>

              <p className={styles.delivery_date}>
                Delivery date -{" "}
                {convertDateToText(+(router.query.date as string))}
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
