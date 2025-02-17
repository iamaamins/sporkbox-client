import Image from 'next/image';
import { useData } from '@context/Data';
import { useCart } from '@context/Cart';
import { useRouter } from 'next/router';
import { HiMinus, HiPlus } from 'react-icons/hi';
import styles from './PlaceOrderItem.module.css';
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
  Item as ItemType,
  Addons,
  InitialItem,
  UpcomingRestaurant,
  RemovableIngredients,
  SetAddonsOrRemovableIngredients,
  AddonsOrRemovableIngredientsType,
} from 'types';
import { useAlert } from '@context/Alert';
import { AiFillStar } from 'react-icons/ai';
import AddonsOrRemovableIngredients from './AddonsOrRemovableIngredients';

export default function PlaceOrderItem() {
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
    extraRequiredAddons: [],
    removableIngredients: [],
  };
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [item, setItem] = useState<ItemType>();
  const { upcomingRestaurants } = useData();
  const { cartItems, addItemToCart } = useCart();
  const [upcomingRestaurant, setUpcomingRestaurant] =
    useState<UpcomingRestaurant>();
  const [optionalAddons, setOptionalAddons] = useState<Addons>();
  const [requiredAddons, setRequiredAddons] = useState<Addons>();
  const [extraRequiredAddons, setExtraRequiredAddons] = useState<Addons>();
  const [removableIngredients, setRemovableIngredients] =
    useState<RemovableIngredients>();
  const [initialItem, setInitialItem] = useState<InitialItem>(initialState);

  const { price, quantity, addonPrice } = initialItem;

  function increaseQuantity() {
    setInitialItem((prevState) => ({
      ...prevState,
      quantity: prevState.quantity + 1,
      addonPrice:
        (prevState.addonPrice / prevState.quantity) * (prevState.quantity + 1),
    }));
  }

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
    setData: SetAddonsOrRemovableIngredients,
    dataType: AddonsOrRemovableIngredientsType
  ) {
    if (
      (dataType === 'optionalAddons' ||
        dataType === 'requiredAddons' ||
        dataType === 'extraRequiredAddons') &&
      item &&
      item[dataType].addable === initialItem[dataType].length &&
      e.target.checked
    ) {
      // Show alert
      return showErrorAlert(
        `Can't add more than ${item[dataType].addable} add-on item`,
        setAlerts
      );
    }

    // Update optional and required
    // addons, and removable ingredients state
    setData((prevState) => ({
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
        (dataType === 'optionalAddons' ||
          dataType === 'requiredAddons' ||
          dataType === 'extraRequiredAddons') &&
        e.target.name.split('-').length > 1
          ? e.target.checked
            ? prevState.addonPrice +
              getAddonPrice(e.target.name) * prevState.quantity
            : prevState.addonPrice -
              getAddonPrice(e.target.name) * prevState.quantity
          : prevState.addonPrice,
      [dataType]: e.target.checked
        ? [...prevState[dataType], e.target.name]
        : prevState[dataType].filter(
            (ingredient) => ingredient !== e.target.name
          ),
    }));
  }

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (upcomingRestaurants.data.length > 0 && router.isReady) {
      const upcomingRestaurant = upcomingRestaurants.data.find(
        (upcomingRestaurant) =>
          dateToMS(upcomingRestaurant.schedule.date).toString() ===
            router.query.date &&
          upcomingRestaurant._id === router.query.restaurant &&
          upcomingRestaurant.company.shift === router.query.shift
      );

      if (upcomingRestaurant) {
        setUpcomingRestaurant(upcomingRestaurant);
        const deliveryDate = dateToMS(upcomingRestaurant.schedule.date);
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
            extraRequiredAddons: [],
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
              extraRequiredAddons: itemInCart.extraRequiredAddons,
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

          if (item.extraRequiredAddons.addons) {
            setExtraRequiredAddons(
              formatAddons(item.extraRequiredAddons.addons).reduce(
                (acc, curr) => {
                  const ingredient = curr.trim();
                  if (itemInCart?.extraRequiredAddons.includes(ingredient)) {
                    return { ...acc, [ingredient]: true };
                  } else {
                    return { ...acc, [ingredient]: false };
                  }
                },
                {}
              )
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

  return (
    <section className={styles.container}>
      {upcomingRestaurants.isLoading && <h2>Loading...</h2>}
      {!upcomingRestaurants.isLoading && !item && <h2>No item found</h2>}
      {upcomingRestaurant && item && (
        <>
          <div className={styles.image_and_details}>
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
                  {item.averageRating && (
                    <span>
                      <AiFillStar />
                      {item.averageRating}
                    </span>
                  )}
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
                    {optionalAddons && (
                      <AddonsOrRemovableIngredients
                        data={optionalAddons}
                        setData={setOptionalAddons}
                        dataType='optionalAddons'
                        handleChange={changeAddonsOrRemovableIngredients}
                      />
                    )}
                  </div>
                )}
                {item.requiredAddons.addons && (
                  <div className={styles.required_addons}>
                    <p>
                      Required add-ons - must choose{' '}
                      {item.requiredAddons.addable}
                    </p>
                    {requiredAddons && (
                      <AddonsOrRemovableIngredients
                        data={requiredAddons}
                        setData={setRequiredAddons}
                        dataType='requiredAddons'
                        handleChange={changeAddonsOrRemovableIngredients}
                      />
                    )}
                  </div>
                )}
                {item.extraRequiredAddons.addons && (
                  <div className={styles.required_addons}>
                    <p>
                      Extra required add-ons - must choose{' '}
                      {item.extraRequiredAddons.addable}
                    </p>
                    {extraRequiredAddons && (
                      <AddonsOrRemovableIngredients
                        data={extraRequiredAddons}
                        setData={setExtraRequiredAddons}
                        dataType='extraRequiredAddons'
                        handleChange={changeAddonsOrRemovableIngredients}
                      />
                    )}
                  </div>
                )}
                {item.removableIngredients && (
                  <div className={styles.removable}>
                    <p>Remove ingredients</p>
                    {removableIngredients && (
                      <AddonsOrRemovableIngredients
                        data={removableIngredients}
                        setData={setRemovableIngredients}
                        dataType='removableIngredients'
                        handleChange={changeAddonsOrRemovableIngredients}
                      />
                    )}
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
                <div onClick={increaseQuantity} className={`${styles.icon}`}>
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
          </div>
        </>
      )}
    </section>
  );
}
