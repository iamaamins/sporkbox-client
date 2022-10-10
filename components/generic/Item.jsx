import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import { HiMinus, HiPlus } from "react-icons/hi";
import { convertNumber } from "@utils/index";
import { useCart } from "@context/cart";
import styles from "@styles/generic/Item.module.css";
import Image from "next/image";

export default function Item() {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const { scheduledRestaurants } = useData();
  const { addItemToCart } = useCart();
  const [initialItem, setInitialItem] = useState({
    id: "",
    name: "",
    quantity: 1,
    price: "",
    total: "",
    date: "",
    restaurant: "",
  });

  // Price and quantity
  const { quantity, price } = initialItem;

  // Get the item from schedules restaurants
  useEffect(() => {
    if (scheduledRestaurants && router.isReady) {
      setItem(
        scheduledRestaurants
          .find((restaurant) => restaurant._id === router.query.restaurant)
          .items.find((item) => item._id === router.query.item)
      );
    }
  }, [scheduledRestaurants, router.isReady]);

  // Update initial item
  useEffect(() => {
    if (item && router.isReady) {
      setInitialItem({
        id: item._id,
        name: item.name,
        quantity: 1,
        price: +item.price,
        total: +item.price,
        date: +router.query.date,
        restaurant: router.query.restaurant,
      });
    }
  }, [item, router.isReady]);

  // Increase quantity
  function increaseQuantity() {
    setInitialItem((prevItem) => ({
      ...prevItem,
      quantity: prevItem.quantity + 1,
      total: convertNumber(prevItem.price * (prevItem.quantity + 1)),
    }));
  }

  // Decrease quantity
  function decreaseQuantity() {
    setInitialItem((prevItem) => ({
      ...prevItem,
      quantity: prevItem.quantity - 1,
      total: convertNumber(prevItem.price * (prevItem.quantity - 1)),
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
              <p className={styles.item_tags}>{item.tags}</p>
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
              onClick={() => addItemToCart(initialItem)}
            >
              Add {quantity} to basket • {convertNumber(quantity * price)} USD
            </button>
          </div>
        </>
      )}
    </section>
  );
}
