import Image from 'next/image';
import { useData } from '@context/Data';
import { useCart } from '@context/Cart';
import { useRouter } from 'next/router';
import { HiMinus, HiPlus } from 'react-icons/hi';
import styles from '@styles/generic/Item.module.css';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  splitTags,
  formatAddons,
  dateToMS,
  dateToText,
  numberToUSD,
  showErrorAlert,
} from '@utils/index';
import { useAlert } from '@context/Alert';
import { Item as IItem, InitialItem, UpcomingRestaurant } from 'types';

interface Addon {
  [key: string]: boolean;
}
type AddonsType = 'requiredAddons' | 'optionalAddons';
interface RemovableIngredients extends Addon {}
type SetAddons = Dispatch<SetStateAction<Addon[]>>;

export default function Item() {
  // Initial state
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

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [item, setItem] = useState<IItem>();
  const { upcomingRestaurants } = useData();
  const { cartItems, addItemToCart } = useCart();
  const [upcomingRestaurant, setUpcomingRestaurant] =
    useState<UpcomingRestaurant>();
  const [optionalAddons, setOptionalAddons] = useState<Addon[]>([]);
  const [requiredAddons, setRequiredAddons] = useState<Addon[]>([]);
  const [removableIngredients, setRemovableIngredients] =
    useState<RemovableIngredients>({});
  const [initialItem, setInitialItem] = useState<InitialItem>(initialState);

  // Price and quantity
  const { price, quantity, addonPrice } = initialItem;

  // Get item and date from schedules restaurants
  useEffect(() => {
    if (upcomingRestaurants.data.length > 0 && router.isReady) {
      // Find the restaurant
      const upcomingRestaurant = upcomingRestaurants.data.find(
        (upcomingRestaurant) =>
          dateToMS(upcomingRestaurant.date).toString() === router.query.date &&
          upcomingRestaurant._id === router.query.restaurant &&
          upcomingRestaurant.company.shift === router.query.shift
      );

      if (upcomingRestaurant) {
        // Update state
        setUpcomingRestaurant(upcomingRestaurant);

        // Get the date
        const deliveryDate = dateToMS(upcomingRestaurant.date);

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
              removableIngredients: itemInCart.removableIngredients,
            });
          } else {
            // If item ins't in cart
            setInitialItem(itemDetails);
          }

          if (item.optionalAddons.length > 0) {
            // Update optional addons state
            setOptionalAddons(
              item.optionalAddons.map((optionalAddon) =>
                formatAddons(optionalAddon.addons).reduce((acc, curr) => {
                  // Trim ingredients
                  const ingredient = curr.trim();

                  if (
                    itemInCart?.optionalAddons.some((el) =>
                      el.addons.includes(ingredient)
                    )
                  ) {
                    return { ...acc, [ingredient]: true };
                  } else {
                    return { ...acc, [ingredient]: false };
                  }
                }, {})
              )
            );
          }

          if (item.requiredAddons.length > 0) {
            // Update required addons state
            setRequiredAddons(
              item.requiredAddons.map((requiredAddon) =>
                formatAddons(requiredAddon.addons).reduce((acc, curr) => {
                  // Trim ingredients
                  const ingredient = curr.trim();

                  if (
                    itemInCart?.requiredAddons.some((el) =>
                      el.addons.includes(ingredient)
                    )
                  ) {
                    return {
                      ...acc,
                      [ingredient]: true,
                    };
                  } else {
                    return {
                      ...acc,
                      [ingredient]: false,
                    };
                  }
                }, {})
              )
            );
          }

          if (item.removableIngredients) {
            // Update removable ingredients state
            setRemovableIngredients(
              item.removableIngredients.split(',').reduce((acc, curr) => {
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
    setInitialItem((prevState) => ({
      ...prevState,
      quantity: prevState.quantity - 1,
    }));
  }

  // Handle change addon
  function changeAddon(
    e: ChangeEvent<HTMLInputElement>,
    addonsType: AddonsType,
    addonIndex: number,
    setAddons: SetAddons
  ) {
    if (!item) return;

    // Get item addon
    const itemAddon = item[addonsType].find(
      (el, index) => index === addonIndex
    );

    // Get added addon
    const addedAddons = initialItem[addonsType].find(
      (el) => el.index === addonIndex
    )?.addons;

    // Check optional and required addons' addable
    if (itemAddon?.addable === addedAddons?.length && e.target.checked) {
      return showErrorAlert(
        `Can't add more than ${itemAddon?.addable} addons`,
        setAlerts
      );
    }

    // Update state
    setAddons((prevState) =>
      prevState.map((el) => {
        if (el.hasOwnProperty(e.target.id)) {
          return {
            ...el,
            [e.target.id]: e.target.checked,
          };
        } else {
          return el;
        }
      })
    );

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
        e.target.name.split('-').length > 1
          ? e.target.checked
            ? prevState.addonPrice + getAddonPrice(e.target.name)
            : prevState.addonPrice - getAddonPrice(e.target.name)
          : prevState.addonPrice,
      [addonsType]: !prevState[addonsType].some((el) => el.index === addonIndex)
        ? [
            ...prevState[addonsType],
            { addons: [e.target.name], index: addonIndex },
          ]
        : prevState[addonsType].map((addon) => {
            if (addon.index === addonIndex) {
              return {
                ...addon,
                addons: e.target.checked
                  ? [...addon.addons, e.target.name]
                  : addon.addons.filter((el) => el !== e.target.name),
              };
            } else {
              return addon;
            }
          }),
    }));
  }

  // Render addon
  const renderAddon = (
    addonIndex: number,
    addons: Addon[],
    addonsType: AddonsType,
    setAddons: SetAddons
  ) => {
    // Get addon
    const addon = addons.find((el, index) => index === addonIndex) as Addon;

    return (
      <div className={styles.addons}>
        {Object.keys(addon).map((ingredient, index) => (
          <div key={index} className={styles.addons_item}>
            <input
              type='checkbox'
              name={ingredient}
              id={ingredient}
              checked={addon[ingredient]}
              onChange={(e) =>
                changeAddon(e, addonsType, addonIndex, setAddons)
              }
            />
            <label htmlFor={ingredient}>{ingredient}</label>
          </div>
        ))}
      </div>
    );
  };

  // Change removable ingredients
  function changeRemovableIngredients(e: ChangeEvent<HTMLInputElement>) {
    setRemovableIngredients((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));

    setInitialItem((prevState) => ({
      ...prevState,
      removableIngredients: e.target.checked
        ? [...prevState.removableIngredients, e.target.id]
        : prevState.removableIngredients.filter((el) => el !== e.target.id),
    }));
  }

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

              {item.optionalAddons.length > 0 && optionalAddons && (
                <div className={styles.optional_addons}>
                  <p>Optional add-ons</p>

                  {item.optionalAddons.map((optionalAddon, index) => (
                    <div key={index}>
                      <p>Add up to {optionalAddon.addable}</p>

                      {renderAddon(
                        index,
                        optionalAddons,
                        'optionalAddons',
                        setOptionalAddons
                      )}
                    </div>
                  ))}
                </div>
              )}

              {item.requiredAddons.length > 0 && requiredAddons && (
                <div className={styles.required_addons}>
                  <p>Required add-ons</p>

                  {item.requiredAddons.map((requiredAddon, index) => (
                    <div key={index}>
                      <p>Must choose {requiredAddon.addable}</p>

                      {renderAddon(
                        index,
                        requiredAddons,
                        'requiredAddons',
                        setRequiredAddons
                      )}
                    </div>
                  ))}
                </div>
              )}

              {item.removableIngredients && (
                <div className={styles.removable}>
                  <p>Remove ingredients</p>

                  <div className={styles.removable_ingredients}>
                    {Object.keys(removableIngredients).map((el, index) => (
                      <div
                        key={index}
                        className={styles.removable_ingredients_item}
                      >
                        <input
                          id={el}
                          type='checkbox'
                          checked={removableIngredients[el]}
                          onChange={changeRemovableIngredients}
                        />
                        <label htmlFor={el}>{el}</label>
                      </div>
                    ))}
                  </div>
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
