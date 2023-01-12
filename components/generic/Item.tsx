import Image from "next/image";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import styles from "@styles/generic/Item.module.css";
import {
  expiresIn,
  convertDateToMS,
  formatCurrencyToUSD,
  convertDateToText,
} from "@utils/index";
import {
  ICartItem,
  IItem,
  IUpcomingWeekRestaurant,
  IAddOrRemovableIngredients,
} from "types";

export default function Item() {
  // Initial state
  const initialState = {
    _id: "",
    name: "",
    price: 0,
    image: "",
    quantity: 1,
    expiresIn: 0,
    restaurantId: "",
    deliveryDate: 0,
  };

  // Hooks
  const router = useRouter();
  const { addItemToCart } = useCart();
  const [item, setItem] = useState<IItem>();
  const { upcomingWeekRestaurants } = useData();
  const [cartItem, setCarItem] = useState<ICartItem>(initialState);
  const [upcomingWeekRestaurant, setUpcomingWeekRestaurant] =
    useState<IUpcomingWeekRestaurant>();
  const [addableIngredients, setAddableIngredients] =
    useState<IAddOrRemovableIngredients>();
  const [removableIngredients, setRemovableIngredients] =
    useState<IAddOrRemovableIngredients>();

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
          // Get the date
          const deliveryDate = convertDateToMS(upcomingWeekRestaurant.date);

          // Update states
          setItem(item);
          setCarItem((currItem) => ({
            ...currItem,
            quantity: 1,
            deliveryDate,
            _id: item._id,
            name: item.name,
            price: item.price,
            expiresIn: expiresIn,
            restaurantId: upcomingWeekRestaurant._id,
            image: item.image || upcomingWeekRestaurant.logo,
          }));

          if (item.addableIngredients) {
            setAddableIngredients(
              item.addableIngredients
                .split(",")
                .reduce((acc, curr) => ({ ...acc, [curr.trim()]: false }), {})
            );
          }

          if (item.removableIngredients) {
            setRemovableIngredients(
              item.removableIngredients
                .split(",")
                .reduce((acc, curr) => ({ ...acc, [curr.trim()]: false }), {})
            );
          }
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

  // Handle change addable and removable ingredients
  function changeIngredients(
    e: ChangeEvent<HTMLInputElement>,
    setIngredients: Dispatch<
      SetStateAction<IAddOrRemovableIngredients | undefined>
    >
  ) {
    setIngredients((currState) => ({
      ...currState,
      [e.target.id]: e.target.checked,
    }));
  }

  // Render ingredients
  const renderIngredients = (
    ingredients: IAddOrRemovableIngredients,
    setIngredients: Dispatch<
      SetStateAction<IAddOrRemovableIngredients | undefined>
    >
  ) => (
    <div className={styles.add_or_removable_items}>
      {Object.keys(ingredients).map((ingredient, index) => (
        <div key={index} className={styles.add_or_removable_item}>
          <label htmlFor={ingredient}>{ingredient}</label>
          <input
            type="checkbox"
            id={ingredient}
            checked={ingredients[ingredient]}
            onChange={(e) => changeIngredients(e, setIngredients)}
          />
        </div>
      ))}
    </div>
  );

  // Addable ingredients
  const renderAddableIngredients =
    addableIngredients &&
    renderIngredients(addableIngredients, setAddableIngredients);

  // Removable ingredients
  const renderRemovableIngredients =
    removableIngredients &&
    renderIngredients(removableIngredients, setRemovableIngredients);

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

              {item.addableIngredients && (
                <div className={styles.addable}>
                  <p>Add ingredients</p>
                  {renderAddableIngredients}
                </div>
              )}

              {item.removableIngredients && (
                <div className={styles.removable}>
                  <p>Remove ingredients</p>
                  {renderRemovableIngredients}
                </div>
              )}
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
              <div onClick={increaseQuantity} className={`${styles.icon} `}>
                <HiPlus />
              </div>
            </div>

            <button
              className={`${styles.button}`}
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
