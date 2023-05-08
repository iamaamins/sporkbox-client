import Image from "next/image";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useRouter } from "next/router";
import { HiMinus, HiPlus } from "react-icons/hi";
import styles from "@styles/generic/Item.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  convertDateToMS,
  formatCurrencyToUSD,
  convertDateToText,
  formatAddons,
  splitTags,
} from "@utils/index";
import {
  IItem,
  IAddons,
  IInitialItem,
  SetIngredients,
  IngredientsType,
  IUpcomingRestaurant,
  IRemovableIngredients,
  IAddOrRemovableIngredients,
} from "types";

export default function Item() {
  // Initial state
  const initialState = {
    _id: "",
    name: "",
    price: 0,
    image: "",
    shift: "",
    quantity: 1,
    companyId: "",
    addonPrice: 0,
    restaurantId: "",
    deliveryDate: 0,
    optionalAddons: [],
    requiredAddons: [],
    removableIngredients: [],
  };

  // Hooks
  const router = useRouter();
  const [item, setItem] = useState<IItem>();
  const { upcomingRestaurants } = useData();
  const { cartItems, addItemToCart } = useCart();
  const [upcomingRestaurant, setUpcomingRestaurant] =
    useState<IUpcomingRestaurant>();
  const [optionalAddons, setOptionalAddons] = useState<IAddons>();
  const [requiredAddons, setRequiredAddons] = useState<IAddons>();
  const [removableIngredients, setRemovableIngredients] =
    useState<IRemovableIngredients>();
  const [initialItem, setInitialItem] = useState<IInitialItem>(initialState);

  // Price and quantity
  const { price, quantity, addonPrice } = initialItem;

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (upcomingRestaurants.data.length > 0 && router.isReady) {
      // Find the restaurant
      const upcomingRestaurant = upcomingRestaurants.data.find(
        (upcomingRestaurant) =>
          convertDateToMS(upcomingRestaurant.date).toString() ===
            router.query.date &&
          upcomingRestaurant._id === router.query.restaurant &&
          upcomingRestaurant.company.shift === router.query.shift
      );

      if (upcomingRestaurant) {
        // Update state
        setUpcomingRestaurant(upcomingRestaurant);

        // Get the date
        const deliveryDate = convertDateToMS(upcomingRestaurant.date);

        // Find the item
        const item = upcomingRestaurant.items.find(
          (item) => item._id === router.query.item
        );

        if (item) {
          // Update item
          setItem(item);

          // Create generic item details
          const itemDetails = {
            addonPrice,
            quantity: 1,
            deliveryDate,
            _id: item._id,
            name: item.name,
            price: item.price,
            optionalAddons: [],
            requiredAddons: [],
            removableIngredients: [],
            restaurantId: upcomingRestaurant._id,
            shift: upcomingRestaurant.company.shift,
            companyId: upcomingRestaurant.company._id,
            image: item.image || upcomingRestaurant.logo,
          };

          // Find if the item exists in the cart
          const itemInCart = cartItems.find(
            (cartItem) =>
              cartItem._id === item._id &&
              cartItem.deliveryDate === deliveryDate &&
              cartItem.companyId === upcomingRestaurant.company._id
          );

          if (itemInCart) {
            setInitialItem({
              ...itemDetails,
              quantity: itemInCart.quantity,
              addonPrice: itemInCart.addonPrice,
              optionalAddons: itemInCart.optionalAddons,
              requiredAddons: itemInCart.requiredAddons,
              // addableIngredients: itemInCart.addableIngredients,
              removableIngredients: itemInCart.removableIngredients,
            });
          } else {
            // If item ins't in cart
            setInitialItem(itemDetails);
          }

          if (item.optionalAddons) {
            // Update addable ingredients state
            setOptionalAddons(
              formatAddons(item.optionalAddons.addons).reduce((acc, curr) => {
                // Trim ingredients
                const ingredient = curr.trim();

                if (itemInCart?.optionalAddons.includes(ingredient)) {
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
  }, [upcomingRestaurants, router.isReady]);

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

    // Add on price
    const getAddonPrice = (name: string) =>
      +name
        .split("-")
        .map((el) => el.trim())[1]
        .slice(1);

    // Update initial item state
    setInitialItem((currState) => ({
      ...currState,
      addonPrice:
        ingredientsType === "optionalAddons" &&
        e.target.name.split("-").length > 1
          ? e.target.checked
            ? currState.addonPrice + getAddonPrice(e.target.name)
            : currState.addonPrice - getAddonPrice(e.target.name)
          : currState.addonPrice,
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
          <input
            type="checkbox"
            name={ingredient}
            id={ingredient}
            checked={ingredients[ingredient]}
            onChange={(e) =>
              changeIngredients(e, setIngredients, ingredientsType)
            }
          />
          <label htmlFor={ingredient}>{ingredient}</label>
        </div>
      ))}
    </div>
  );

  // Optional addons
  const renderOptionalAddons =
    optionalAddons &&
    renderIngredients(optionalAddons, setOptionalAddons, "optionalAddons");

  // Required addons
  const renderRequiredAddons =
    requiredAddons &&
    renderIngredients(requiredAddons, setRequiredAddons, "requiredAddons");

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
      {upcomingRestaurants.isLoading && <h2>Loading...</h2>}

      {!upcomingRestaurants.isLoading && !item && <h2>No item found</h2>}

      {upcomingRestaurant && item && (
        <>
          <div className={styles.cover_image}>
            <Image
              src={item.image || upcomingRestaurant.logo}
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
                {splitTags(item.tags).map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </p>

              <p className={styles.delivery_date}>
                Delivery date -{" "}
                {convertDateToText(+(router.query.date as string))}
              </p>

              {item.optionalAddons && (
                <div className={styles.optional_addons}>
                  <p>Optional addons</p>
                  {renderOptionalAddons}
                </div>
              )}

              {item.requiredAddons && (
                <div className={styles.required_addons}>
                  <p>Required addons</p>
                  {renderRequiredAddons}
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
              Add {quantity} to basket •{" "}
              {formatCurrencyToUSD(quantity * price + addonPrice)} USD
            </button>
          </div>
        </>
      )}
    </section>
  );
}
