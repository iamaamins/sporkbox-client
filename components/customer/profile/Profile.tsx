import { useEffect, useState } from 'react';
import { useUser } from '@context/User';
import {
  axiosInstance,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import styles from './Profile.module.css';
import { CustomAxiosError, Shift } from 'types';
import { useAlert } from '@context/Alert';
import FoodPreferences from './FoodPreferences';
import { PiSunFill } from 'react-icons/pi';
import { PiMoonStarsFill } from 'react-icons/pi';

export default function Profile() {
  const { customer, setCustomer } = useUser();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [showShiftChangeModal, setShowShiftChangeModal] = useState(false);
  const [showFoodPreferencesModal, setShowFoodPreferencesModal] =
    useState(false);

  const [shift, setShift] = useState<Shift | null>(null);

  const isSubscribed =
    customer && Object.values(customer.subscribedTo).includes(true);

  const company = customer?.companies.find((el) => el.status === 'ACTIVE');

  async function handleEmailSubscriptions() {
    if (!customer) return;

    try {
      setIsLoading(true);
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
    }
  }

  async function switchShift() {
    try {
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
    }
  }

  useEffect(() => {
    if (customer) {
      const activeCompany = customer.companies.find(
        (company) => company.status === 'ACTIVE'
      );
      activeCompany && setShift(activeCompany.shift);
    }
  }, [customer]);

  return (
    <section className={styles.container}>
      <div className={styles.shift_preferences_tools}>
        <div className={styles.shift}>
          <h2>Shift</h2>
          <button
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
        <div className={styles.preferences}>
          <h2>My Dietary Preferences</h2>
        </div>
      </div>
    </section>
  );
}
