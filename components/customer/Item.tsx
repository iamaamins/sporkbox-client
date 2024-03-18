import Image from 'next/image';
import { useData } from '@context/Data';
import { useCart } from '@context/Cart';
import { useRouter } from 'next/router';
import { HiMinus, HiPlus } from 'react-icons/hi';
import styles from './Item.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  splitTags,
  formatAddons,
  dateToMS,
  dateToText,
  numberToUSD,
  showErrorAlert,
} from '@lib/utils';
import {
  IItem,
  IAddons,
  IInitialItem,
  IUpcomingRestaurant,
  IRemovableIngredients,
  SetAddonsOrRemovableIngredients,
  IAddonsOrRemovableIngredientsType,
} from 'types';
import { useAlert } from '@context/Alert';

const initialState = {
  _id: '',
  name: '',
  price: 0,
  image: '',
  shift: '',
  quantity: 1,
  companyId: '',
  addonPrice: 0,
  restaurantId: '',
  deliveryDate: 0,
  optionalAddons: [],
  requiredAddons: [],
  removableIngredients: [],
};

export default function Item() {
  const router = useRouter();
  const { setAlerts } = useAlert();
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

  const { price, quantity, addonPrice } = initialItem;

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (upcomingRestaurants.data.length > 0 && router.isReady) {
      const upcomingRestaurant = upcomingRestaurants.data.find(
        (upcomingRestaurant) =>
          dateToMS(upcomingRestaurant.date).toString() === router.query.date &&
          upcomingRestaurant._id === router.query.restaurant &&
          upcomingRestaurant.company.shift === router.query.shift
      );

      if (upcomingRestaurant) {
        setUpcomingRestaurant(upcomingRestaurant);
        const deliveryDate = dateToMS(upcomingRestaurant.date);
        const item = upcomingRestaurant.items.find(
          (item) => item._id === router.query.item
        );

        if (item) {
          setItem(item);
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
              removableIngredients: itemInCart.removableIngredients,
            });
          } else {
            setInitialItem(itemDetails);
          }

          if (item.optionalAddons.addons) {
            setOptionalAddons(
              formatAddons(item.optionalAddons.addons).reduce((acc, curr) => {
                const ingredient = curr.trim();
                if (itemInCart?.optionalAddons.includes(ingredient)) {
                  return { ...acc, [ingredient]: true };
                } else {
                  return { ...acc, [ingredient]: false };
                }
              }, {})
            );
          }

          if (item.requiredAddons.addons) {
            setRequiredAddons(
              formatAddons(item.requiredAddons.addons).reduce((acc, curr) => {
                const ingredient = curr.trim();
                if (itemInCart?.requiredAddons.includes(ingredient)) {
                  return { ...acc, [ingredient]: true };
                } else {
                  return { ...acc, [ingredient]: false };
                }
              }, {})
            );
          }

          if (item.removableIngredients) {
            setRemovableIngredients(
              item.removableIngredients.split(',').reduce((acc, curr) => {
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
    setInitialItem((prevState) => ({
      ...prevState,
      quantity: prevState.quantity + 1,
      addonPrice:
        (prevState.addonPrice / prevState.quantity) * (prevState.quantity + 1),
    }));
  }

  // Decrease quantity
  function decreaseQuantity() {
    setInitialItem((prevState) => ({
      ...prevState,
      quantity: prevState.quantity - 1,
      addonPrice:
        (prevState.addonPrice / prevState.quantity) * (prevState.quantity - 1),
    }));
  }

  // Handle change optional and required
  // addons, and removable ingredients
  function changeAddonsOrRemovableIngredients(
    e: ChangeEvent<HTMLInputElement>,
    setAddonsOrRemovableIngredients: SetAddonsOrRemovableIngredients,
    addonsOrRemovableIngredientsType: IAddonsOrRemovableIngredientsType
  ) {
    if (
      (addonsOrRemovableIngredientsType === 'optionalAddons' ||
        addonsOrRemovableIngredientsType === 'requiredAddons') &&
      item &&
      item[addonsOrRemovableIngredientsType].addable ===
        initialItem[addonsOrRemovableIngredientsType].length &&
      e.target.checked
    ) {
      // Show alert
      return showErrorAlert(
        `Can't add more than ${item[addonsOrRemovableIngredientsType].addable} add-on item`,
        setAlerts
      );
    }

    // Update optional and required
    // addons, and removable ingredients state
    setAddonsOrRemovableIngredients((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));

    // Add on price
    const getAddonPrice = (name: string) =>
      +name
        .split('-')
        .map((el) => el.trim())[1]
        .slice(1);

    // Update initial item state
    setInitialItem((prevState) => ({
      ...prevState,
      addonPrice:
        (addonsOrRemovableIngredientsType === 'optionalAddons' ||
          addonsOrRemovableIngredientsType === 'requiredAddons') &&
        e.target.name.split('-').length > 1
          ? e.target.checked
            ? prevState.addonPrice +
              getAddonPrice(e.target.name) * prevState.quantity
            : prevState.addonPrice -
              getAddonPrice(e.target.name) * prevState.quantity
          : prevState.addonPrice,
      [addonsOrRemovableIngredientsType]: e.target.checked
        ? [...prevState[addonsOrRemovableIngredientsType], e.target.name]
        : prevState[addonsOrRemovableIngredientsType].filter(
            (ingredient) => ingredient !== e.target.name
          ),
    }));
  }

  // Render addons and removable ingredients
  const renderAddonsOrRemovableIngredients = (
    addonsOrRemovableIngredients: IAddons | IRemovableIngredients,
    setAddonsOrRemovableIngredients: SetAddonsOrRemovableIngredients,
    addonsOrRemovableIngredientsType: IAddonsOrRemovableIngredientsType
  ) => (
    <div className={styles.addons_and_removable_items}>
      {Object.keys(addonsOrRemovableIngredients).map(
        (addonsOrRemovableIngredient, index) => (
          <div key={index} className={styles.addons_and_removable_item}>
            <input
              type='checkbox'
              name={addonsOrRemovableIngredient}
              id={addonsOrRemovableIngredient}
              checked={
                addonsOrRemovableIngredients[addonsOrRemovableIngredient]
              }
              onChange={(e) =>
                changeAddonsOrRemovableIngredients(
                  e,
                  setAddonsOrRemovableIngredients,
                  addonsOrRemovableIngredientsType
                )
              }
            />
            <label htmlFor={addonsOrRemovableIngredient}>
              {addonsOrRemovableIngredient}
            </label>
          </div>
        )
      )}
    </div>
  );

  // Optional addons
  const renderOptionalAddons =
    optionalAddons &&
    renderAddonsOrRemovableIngredients(
      optionalAddons,
      setOptionalAddons,
      'optionalAddons'
    );

  // Required addons
  const renderRequiredAddons =
    requiredAddons &&
    renderAddonsOrRemovableIngredients(
      requiredAddons,
      setRequiredAddons,
      'requiredAddons'
    );

  // Removable ingredients
  const renderRemovableIngredients =
    removableIngredients &&
    renderAddonsOrRemovableIngredients(
      removableIngredients,
      setRemovableIngredients,
      'removableIngredients'
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
              layout='responsive'
              objectFit='cover'
            />
          </div>
          <div className={styles.details_controller_and_button}>
            <div className={styles.item_details}>
              <p className={styles.item_name}>
                {item.name} - {numberToUSD(item.price)}
              </p>
              <p className={styles.item_description}>{item.description}</p>
              <p className={styles.tags}>
                {splitTags(item.tags).map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </p>

              <p className={styles.delivery_date}>
                Delivery date - {dateToText(+(router.query.date as string))}
              </p>

              {item.optionalAddons.addons && (
                <div className={styles.optional_addons}>
                  <p>
                    Optional add-ons - add up to {item.optionalAddons.addable}
                  </p>
                  {renderOptionalAddons}
                </div>
              )}

              {item.requiredAddons.addons && (
                <div className={styles.required_addons}>
                  <p>
                    Required add-ons - must choose {item.requiredAddons.addable}
                  </p>
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
              onClick={() => addItemToCart(initialItem, item)}
            >
              Add {quantity} to basket •{' '}
              {numberToUSD(quantity * price + addonPrice)} USD
            </button>
          </div>
        </>
      )}
    </section>
  );
}
