import { useEffect, useState } from 'react';
import { useUser } from '@context/User';
import {
  axiosInstance,
  dateToText,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import styles from './Profile.module.css';
import { CustomAxiosError, CustomerOrder, Shift } from 'types';
import { useAlert } from '@context/Alert';
import { PiSunFill } from 'react-icons/pi';
import { PiMoonStarsFill } from 'react-icons/pi';
import { useData } from '@context/Data';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customer, setCustomer } = useUser();
  const { dietaryTags, customerUpcomingOrders, customerDeliveredOrders } =
    useData();
  const [isUpdatingEmailSubscriptions, setIsUpdatingEmailSubscriptions] =
    useState(false);
  const [isSwitchingShift, setIsSwitchingShift] = useState(false);
  const [shift, setShift] = useState<Shift | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [mostLiked, setMostLiked] = useState<{
    isLoading: boolean;
    restaurants: string[];
    items: string[];
  }>({ isLoading: true, restaurants: [], items: [] });
  const [foodStats, setFoodStats] = useState({
    isLoading: true,
    orderCount: 0,
    itemCount: 0,
    restaurantCount: 0,
  });

  const isSubscribed =
    customer && Object.values(customer.subscribedTo).includes(true);

  async function updateDietaryPreferences(tag: string) {
    if (!customer) return;

    const updatedPreferences = preferences.includes(tag)
      ? preferences.filter((preference) => preference !== tag)
      : [...preferences, tag];

    try {
      const response = await axiosInstance.patch(
        `/customers/${customer._id}/update-food-preferences`,
        { preferences: updatedPreferences }
      );

      setCustomer(
        (prevState) =>
          prevState && {
            ...prevState,
            foodPreferences: response.data.foodPreferences,
          }
      );

      localStorage.setItem(
        `filters-${customer._id}`,
        JSON.stringify(preferences)
      );
      setPreferences(updatedPreferences);

      showSuccessAlert('Preferences updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  async function updateEmailSubscriptions() {
    if (!customer) return;

    try {
      setIsUpdatingEmailSubscriptions(true);

      const response = await axiosInstance.patch(
        `/customers/${customer._id}/update-email-subscriptions`,
        {
          isSubscribed,
        }
      );

      setCustomer(
        (prevState) =>
          prevState && {
            ...prevState,
            subscribedTo: response.data.subscribedTo,
          }
      );

      showSuccessAlert('Subscriptions updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingEmailSubscriptions(false);
    }
  }

  async function switchShift() {
    try {
      setIsSwitchingShift(true);

      const response = await axiosInstance.patch(
        `/customers/${customer?._id}/${customer?.companies[0].code}/change-customer-shift`,
        { shift: shift === 'night' ? 'day' : 'night' }
      );

      setCustomer(
        (prevState) => prevState && { ...prevState, companies: response.data }
      );

      localStorage.removeItem(`discount-${customer?._id}`);
      localStorage.removeItem(`cart-${customer?._id}`);

      showSuccessAlert('Shift updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsSwitchingShift(false);
    }
  }

  const getRecentOrders = (
    deliveredOrders: CustomerOrder[],
    upcomingOrders: CustomerOrder[]
  ) => [...deliveredOrders.slice(0, 5), ...upcomingOrders.slice(0, 5)];

  const isMatchedTag = (tag: string) => preferences.includes(tag);

  // Set shift and dietary preferences
  useEffect(() => {
    if (customer) {
      const activeCompany = customer.companies.find(
        (company) => company.status === 'ACTIVE'
      );

      if (activeCompany) setShift(activeCompany.shift);
      if (customer.foodPreferences) setPreferences(customer.foodPreferences);
    }
  }, [customer]);

  // Get food stats and most liked restaurants and items
  useEffect(() => {
    async function getFoodStats() {
      try {
        const response = await axiosInstance.get('/orders/me/food-stats');

        setFoodStats({ isLoading: false, ...response.data });
      } catch (err) {
        setFoodStats((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    async function getMostLikedRestaurantsAndItems() {
      try {
        const response = await axiosInstance.get(
          '/orders/me/most-liked-restaurants-and-items'
        );

        setMostLiked({ isLoading: false, ...response.data });
      } catch (err) {
        setMostLiked((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (router.isReady) {
      getFoodStats();
      getMostLikedRestaurantsAndItems();
    }
  }, [router]);

  return (
    <section className={styles.container}>
      <div className={styles.shift_preferences_tools}>
        <div className={styles.shift}>
          <h2>Shift</h2>
          <button
            disabled={isSwitchingShift}
            onClick={switchShift}
            className={`${styles.shift_switcher} ${
              shift === 'night' ? styles.night : styles.day
            }`}
          >
            <span
              className={`${styles.label} ${styles.night} ${
                shift === 'night' ? styles.show : styles.hide
              }`}
            >
              NIGHT
            </span>
            <span
              className={`${styles.label} ${styles.day} ${
                shift === 'night' ? styles.hide : styles.show
              }`}
            >
              DAY
            </span>
            <div
              className={`${styles.toggle} ${
                shift === 'night' ? styles.night : styles.day
              }`}
            >
              {shift === 'night' ? (
                <PiMoonStarsFill size={28} />
              ) : (
                <PiSunFill size={28} />
              )}
            </div>
          </button>
        </div>
        <div className={styles.dietary_preferences}>
          <h2>My Dietary Preferences</h2>
          <div className={styles.preference_icons}>
            {dietaryTags.data.map((tag, index) => (
              <div
                key={index}
                onClick={() => updateDietaryPreferences(tag)}
                className={`${styles.preference_icon} ${
                  isMatchedTag(tag) && styles.matched
                }`}
              >
                <Image
                  width={48}
                  height={48}
                  alt={`${tag} icon`}
                  src={`/customer/${tag.toLowerCase().replace(' ', '-')}.png`}
                />
              </div>
            ))}
          </div>
          <p>
            Click the icon to toggle your meal preference on or off. These
            filters will then apply whenever you are browsing available
            restaurants.
          </p>
        </div>

        <div className={styles.tools}>
          <Link href='/change-password'>
            <a className={styles.change_password_link}>
              <FaUserCircle size={100} color='#cfcfcf' />
              <p>Change password</p>
            </a>
          </Link>
          <Link href='/'>
            <a className={styles.slack_channel_link}>
              <p className={styles.join_slack}>
                Join the Slack channel for instant delivery notifications!
              </p>
              <div className={styles.slack_logo}>
                <Image
                  src='/customer/slack-logo.png'
                  width={1600}
                  height={407}
                />
              </div>
              <p className={styles.company_name}>Twist Wilsonville</p>
            </a>
          </Link>
        </div>
      </div>

      {!foodStats.isLoading && (
        <div className={styles.food_stats}>
          <h2>My Food Stats</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3>Orders Placed</h3>
              <p>{foodStats.orderCount}</p>
            </div>
            <div className={styles.stat}>
              <h3>Items Ordered</h3>
              <p>{foodStats.itemCount}</p>
            </div>
            <div className={styles.stat}>
              <h3>Restaurants Tried</h3>
              <p>{foodStats.restaurantCount}</p>
            </div>
          </div>
        </div>
      )}
      <div className={styles.mood_vibe}>
        <h2>My Food Vibe</h2>
        <p>So Fresh, So Clean</p>
      </div>

      {!mostLiked.isLoading &&
        mostLiked.restaurants.length > 0 &&
        mostLiked.items.length > 0 && (
          <div className={styles.most_liked}>
            <div className={styles.most_liked_restaurants}>
              <h3>Most Liked Restaurants</h3>
              <ol>
                {mostLiked.restaurants.map((restaurant, index) => (
                  <li key={index}>{restaurant}</li>
                ))}
              </ol>
            </div>
            <div className={styles.most_liked_items}>
              <h3>Most Liked Items</h3>
              <ol>
                {mostLiked.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

      {!customerUpcomingOrders.isLoading &&
        !customerDeliveredOrders.isLoading && (
          <div className={styles.recent_orders}>
            <h2>Recent Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {getRecentOrders(
                  customerDeliveredOrders.data,
                  customerUpcomingOrders.data
                ).map((order) => (
                  <tr key={order._id}>
                    <td className={styles.important}>
                      {dateToText(order.delivery.date)}
                    </td>
                    <td>{order.restaurant.name}</td>
                    <td>{order.item.name}</td>
                    <td>{order.item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </section>
  );
}
