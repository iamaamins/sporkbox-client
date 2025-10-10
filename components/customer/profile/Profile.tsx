import { useEffect, useState } from 'react';
import { useUser } from '@context/User';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import styles from './Profile.module.css';
import { CustomAxiosError, Shift } from 'types';
import { useAlert } from '@context/Alert';
import { PiSunFill } from 'react-icons/pi';
import { PiMoonStarsFill } from 'react-icons/pi';
import { useData } from '@context/Data';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
  const { customer, setCustomer } = useUser();
  const { setAlerts } = useAlert();
  const { dietaryTags } = useData();
  const [isUpdatingEmailSubscriptions, setIsUpdatingEmailSubscriptions] =
    useState(false);
  const [isSwitchingShift, setIsSwitchingShift] = useState(false);
  const [shift, setShift] = useState<Shift | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);

  const isSubscribed =
    customer && Object.values(customer.subscribedTo).includes(true);

  const company = customer?.companies.find((el) => el.status === 'ACTIVE');

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

  const isMatchedTag = (tag: string) => preferences.includes(tag);

  useEffect(() => {
    if (customer) {
      const activeCompany = customer.companies.find(
        (company) => company.status === 'ACTIVE'
      );

      if (activeCompany) setShift(activeCompany.shift);
      if (customer.foodPreferences) setPreferences(customer.foodPreferences);
    }
  }, [customer]);

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
          <Link href='/customer/change-password'>
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
    </section>
  );
}
