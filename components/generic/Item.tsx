import Image from "next/image";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useRouter } from "next/router";
import { HiMinus, HiPlus } from "react-icons/hi";
import styles from "@styles/generic/Item.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  expiresIn,
  convertDateToMS,
  formatCurrencyToUSD,
  convertDateToText,
} from "@utils/index";
import {
  IItem,
  IInitialItem,
  SetIngredients,
  IngredientsType,
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
    addableIngredients: [],
    removableIngredients: [],
  };

  // Hooks
  const router = useRouter();
  const { cartItems, addItemToCart } = useCart();
  const [item, setItem] = useState<IItem>();
  const { upcomingWeekRestaurants } = useData();
  const [upcomingWeekRestaurant, setUpcomingWeekRestaurant] =
    useState<IUpcomingWeekRestaurant>();
  const [addableIngredients, setAddableIngredients] =
    useState<IAddOrRemovableIngredients>();
  const [removableIngredients, setRemovableIngredients] =
    useState<IAddOrRemovableIngredients>();
  const [initialItem, setInitialItem] = useState<IInitialItem>(initialState);

  // Price and quantity
  const { quantity, price } = initialItem;

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

        // Get the date
        const deliveryDate = convertDateToMS(upcomingWeekRestaurant.date);

        // Find the item
        const item = upcomingWeekRestaurant.items.find(
          (item) => item._id === router.query.item
        );

        if (item) {
          // Update item
          setItem(item);

          // Create generic item details
          const itemDetails = {
            deliveryDate,
            _id: item._id,
            name: item.name,
            price: item.price,
            expiresIn: expiresIn,
            restaurantId: upcomingWeekRestaurant._id,
            image: item.image || upcomingWeekRestaurant.logo,
          };

          // Find if the item exists in the cart
          const itemInCart = cartItems.find(
            (cartItem) =>
              cartItem._id === item._id &&
              cartItem.deliveryDate === deliveryDate
          );

          if (itemInCart) {
            setInitialItem({
              ...itemDetails,
              quantity: itemInCart.quantity,
              addableIngredients: itemInCart.addableIngredients,
              removableIngredients: itemInCart.removableIngredients,
            });
          } else {
            // If item ins't in cart
            setInitialItem({
              ...itemDetails,
              quantity: 1,
              addableIngredients: [],
              removableIngredients: [],
            });
          }

          if (item.addableIngredients) {
            // Update addable ingredients state
            setAddableIngredients(
              item.addableIngredients.split(",").reduce((acc, curr) => {
                // Trim ingredients
                const ingredient = curr.trim();

                if (itemInCart?.addableIngredients.includes(ingredient)) {
                  return { ...acc, [ingredient]: true };
                } else {
                  return { ...acc, [ingredient]: false };
                }
              }, {})
            );
          }

          if (item.removableIngredients) {
            // Update removable ingredients state
            setRemovableIngredients(
              item.removableIngredients.split(",").reduce((acc, curr) => {
                // Trim ingredient
                const ingredient = curr.trim();

                if (itemInCart?.removableIngredients.includes(ingredient)) {
                  return { ...acc, [ingredient]: true };
                } else {
                  return { ...acc, [ingredient]: false };
                }
              }, {})
            );
          }
        }
      }
    }
  }, [upcomingWeekRestaurants, router.isReady]);

  // Increase quantity
  function increaseQuantity() {
    setInitialItem((currItem) => ({
      ...currItem,
      quantity: currItem.quantity + 1,
    }));
  }

  // Decrease quantity
  function decreaseQuantity() {
    setInitialItem((currState) => ({
      ...currState,
      quantity: currState.quantity - 1,
    }));
  }

  // Handle change addable and removable ingredients
  function changeIngredients(
    e: ChangeEvent<HTMLInputElement>,
    setIngredients: SetIngredients,
    ingredientsType: IngredientsType
  ) {
    // Update addable or removable ingredients state
    setIngredients((currState) => ({
      ...currState,
      [e.target.name]: e.target.checked,
    }));

    // Update initial item state
    setInitialItem((currState) => ({
      ...currState,
      [ingredientsType]: e.target.checked
        ? [...currState[ingredientsType], e.target.name]
        : currState[ingredientsType].filter(
            (ingredient) => ingredient !== e.target.name
          ),
    }));
  }

  // Render ingredients
  const renderIngredients = (
    ingredients: IAddOrRemovableIngredients,
    setIngredients: SetIngredients,
    ingredientsType: IngredientsType
  ) => (
    <div className={styles.add_or_removable_items}>
      {Object.keys(ingredients).map((ingredient, index) => (
        <div key={index} className={styles.add_or_removable_item}>
          <label htmlFor={ingredient}>{ingredient}</label>
          <input
            type="checkbox"
            name={ingredient}
            id={ingredient}
            checked={ingredients[ingredient]}
            onChange={(e) =>
              changeIngredients(e, setIngredients, ingredientsType)
            }
          />
        </div>
      ))}
    </div>
  );

  // Addable ingredients
  const renderAddableIngredients =
    addableIngredients &&
    renderIngredients(
      addableIngredients,
      setAddableIngredients,
      "addableIngredients"
    );

  // Removable ingredients
  const renderRemovableIngredients =
    removableIngredients &&
    renderIngredients(
      removableIngredients,
      setRemovableIngredients,
      "removableIngredients"
    );

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
              onClick={() => addItemToCart(initialItem)}
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
