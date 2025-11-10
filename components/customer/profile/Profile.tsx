import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useUser } from '@context/User';
import {
  axiosInstance,
  dateToText,
  getCustomerShifts,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import styles from './Profile.module.css';
import { CustomAxiosError, Customer, CustomerOrder, Shift } from 'types';
import { useAlert } from '@context/Alert';
import { PiSunFill } from 'react-icons/pi';
import { PiMoonStarsFill } from 'react-icons/pi';
import { useData } from '@context/Data';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Stars from '@components/layout/Stars';
import { EXCLUDED } from 'data/PREFERENCE';
import ModalContainer from '@components/layout/ModalContainer';
import SubmitButton from '@components/layout/SubmitButton';

type RecentOrders = {
  isLoading: boolean;
  data: {
    _id: string;
    date: string;
    restaurant: string;
    item: string;
    status: string;
    rating?: number;
  }[];
};

export default function Profile() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customer, setCustomer } = useUser();
  const { dietaryTags, customerUpcomingOrders, customerDeliveredOrders } =
    useData();
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
  const [recentOrders, setRecentOrders] = useState<RecentOrders>({
    isLoading: true,
    data: [],
  });
  const [
    showEmailSubscriptionUpdateModal,
    setShowEmailSubscriptionUpdateModal,
  ] = useState(false);

  async function switchShift() {
    try {
      setIsSwitchingShift(true);

      const response = await axiosInstance.patch(
        `/customers/${customer?._id}/${customer?.companies[0].code}/update-shift`,
        { shift: shift === 'NIGHT' ? 'DAY' : 'NIGHT' }
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
        JSON.stringify(updatedPreferences)
      );
      setPreferences(updatedPreferences);

      showSuccessAlert('Preferences updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  const isMatchedTag = (tag: string) => preferences.includes(tag);

  // Set shift and dietary preferences
  useEffect(() => {
    if (customer) {
      const activeCompany = customer.companies.find(
        (company) => company.status === 'ACTIVE'
      );

      if (activeCompany) setShift(activeCompany.shift);
      if (customer.foodPreferences)
        setPreferences(
          customer.foodPreferences.filter(
            (preference) => !EXCLUDED.includes(preference)
          )
        );
    }
  }, [customer]);

  // Prepare recent orders
  useEffect(() => {
    async function prepareRecentOrders(
      upcomingOrders: CustomerOrder[],
      deliveredOrders: CustomerOrder[]
    ) {
      const recentDeliveredOrders = deliveredOrders.slice(0, 5);
      const recentUpcomingOrders = upcomingOrders.slice(0, 5);

      const recentOrders = [
        ...recentDeliveredOrders,
        ...recentUpcomingOrders,
      ].map((order) => ({
        _id: order._id,
        status: order.status,
        date: order.delivery.date,
        restaurant: order.restaurant.name,
        item: order.item.name,
      }));

      const reviewedOrderIds = recentDeliveredOrders
        .filter((order) => order.isReviewed)
        .map((order) => order._id);

      if (!reviewedOrderIds.length)
        return setRecentOrders({ isLoading: false, data: recentOrders });

      try {
        const response = await axiosInstance.post<
          { orderId: string; rating: number }[]
        >('/orders/me/rating-data', { orderIds: reviewedOrderIds });

        setRecentOrders({
          isLoading: false,
          data: recentOrders.map((order) => {
            const reviewedOrder = response.data.find(
              (data) => data.orderId === order._id
            );
            if (!reviewedOrder) return order;
            return { ...order, rating: reviewedOrder.rating };
          }),
        });
      } catch (err) {
        setRecentOrders((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (!customerUpcomingOrders.isLoading && !customerDeliveredOrders.isLoading)
      prepareRecentOrders(
        customerUpcomingOrders.data,
        customerDeliveredOrders.data
      );
  }, [customerUpcomingOrders, customerDeliveredOrders]);

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
    <>
      <section className={styles.container}>
        <div className={styles.shift_preferences_tools}>
          {customer && getCustomerShifts(customer).length > 1 && (
            <div className={styles.shift}>
              <h2>Shift</h2>
              <button
                disabled={isSwitchingShift}
                onClick={switchShift}
                className={`${styles.shift_switcher} ${
                  shift === 'NIGHT' ? styles.night : styles.day
                }`}
              >
                <span
                  className={`${styles.label} ${styles.night} ${
                    shift === 'NIGHT' ? styles.show : styles.hide
                  }`}
                >
                  NIGHT
                </span>
                <span
                  className={`${styles.label} ${styles.day} ${
                    shift === 'NIGHT' ? styles.hide : styles.show
                  }`}
                >
                  DAY
                </span>
                <div
                  className={`${styles.toggle} ${
                    shift === 'NIGHT' ? styles.night : styles.day
                  }`}
                >
                  {shift === 'NIGHT' ? (
                    <PiMoonStarsFill size={28} />
                  ) : (
                    <PiSunFill size={28} />
                  )}
                </div>
              </button>
            </div>
          )}
          <div className={styles.dietary_preferences}>
            <h2>Meal Preferences</h2>
            <div className={styles.preference_icons}>
              {dietaryTags.data
                .filter((tag) => !EXCLUDED.includes(tag))
                .map((tag, index) => (
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
                      title={tag}
                      src={`/customer/${tag
                        .toLowerCase()
                        .replace(' ', '-')}.png`}
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
            <button
              onClick={() => setShowEmailSubscriptionUpdateModal(true)}
              className={styles.update_email_preference_button}
            >
              Update Email <br /> Preferences
            </button>
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
        <div className={styles.food_vibe}>
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

        {!recentOrders.isLoading && (
          <div className={styles.recent_orders}>
            <h2>Recent Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th>Item</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.data.map((order) => (
                  <tr key={order._id}>
                    <td className={styles.important}>
                      {dateToText(order.date)}
                    </td>
                    <td>{order.restaurant}</td>
                    <td>{order.item}</td>
                    {order.status === 'PROCESSING' ? (
                      <td>PROCESSING</td>
                    ) : order.rating ? (
                      <td>
                        <Stars rating={order.rating} />
                      </td>
                    ) : (
                      <td>
                        <Link href={`/dashboard/${order._id}`}>
                          <a className={styles.not_reviewed}>NOT REVIEWED</a>
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <ModalContainer
        component={
          <EmailSubscriptionUpdateModal
            setShowEmailSubscriptionUpdateModal={
              setShowEmailSubscriptionUpdateModal
            }
          />
        }
        showModalContainer={showEmailSubscriptionUpdateModal}
        setShowModalContainer={setShowEmailSubscriptionUpdateModal}
      />
    </>
  );
}

function EmailSubscriptionUpdateModal({
  setShowEmailSubscriptionUpdateModal,
}: {
  setShowEmailSubscriptionUpdateModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setAlerts } = useAlert();
  const { customer, setCustomer } = useUser();
  const [isUpdatingEmailSubscriptions, setIsUpdatingEmailSubscriptions] =
    useState(false);
  const [emailSubscriptions, setEmailSubscriptions] = useState<
    Record<string, boolean>
  >({ deliveryNotification: false, orderReminder: false, newsletter: false });

  const formatSubscriptionKey = (key: string) =>
    key
      .split(/(?=[A-Z])/)
      .join(' ')
      .toLowerCase();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmailSubscriptions((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsUpdatingEmailSubscriptions(true);

      const response = await axiosInstance.patch(
        `/customers/${customer?._id}/update-email-subscriptions`,
        {
          emailSubscriptions,
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
      setShowEmailSubscriptionUpdateModal(false);
    }
  }

  // Get customer's existing subscriptions
  useEffect(() => {
    if (customer) setEmailSubscriptions(customer.subscribedTo);
  }, [customer]);

  return (
    <form className={styles.email_subscriptions} onSubmit={handleSubmit}>
      {Object.entries(emailSubscriptions).map(([key, value], index) => (
        <div key={index}>
          <input
            type='checkbox'
            id={key}
            checked={value}
            onChange={handleChange}
          />
          <label htmlFor={key}>{formatSubscriptionKey(key)}</label>
        </div>
      ))}
      <SubmitButton text='Update' isLoading={isUpdatingEmailSubscriptions} />
    </form>
  );
}
