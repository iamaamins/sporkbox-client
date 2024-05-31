import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import SubmitButton from '../layout/SubmitButton';
import { CustomAxiosError, FormData, Restaurant } from 'types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './ScheduleRestaurantsModal.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

export default function ScheduleRestaurantsModal() {
  const initialState = {
    date: '',
    restaurantId: '',
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setScheduledRestaurants } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [approvedRestaurants, setApprovedRestaurants] = useState<Restaurant[]>(
    []
  );
  const [formData, setFormData] = useState<FormData>(initialState);
  const { date, restaurantId } = formData;

  useEffect(() => {
    if (vendors.data.length > 0) {
      setApprovedRestaurants(
        vendors.data
          .filter((vendor) => vendor.status === 'ACTIVE')
          .map((vendor) => vendor.restaurant)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    }
  }, [vendors]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function scheduleRestaurant(e: FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = { ...formData, companyId: router.query.company };
      const response = await axiosInstance.post(
        `/restaurants/schedule-restaurant`,
        data
      );
      setScheduledRestaurants((prevState) => ({
        ...prevState,
        data: [...prevState.data, response.data],
      }));
      setFormData(initialState);
      showSuccessAlert('Restaurant scheduled', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className={styles.schedule_restaurants_modal}>
      <h2>Schedule restaurants</h2>
      <form onSubmit={scheduleRestaurant}>
        <div className={styles.item}>
          <label htmlFor='date'>Select a date</label>
          <input
            type='date'
            id='date'
            value={date}
            min={minDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <select
            id='restaurantId'
            value={restaurantId}
            onChange={handleChange}
          >
            <option hidden aria-hidden value='Please select a restaurant'>
              Please select a restaurant
            </option>

            {approvedRestaurants.map((approvedRestaurant) => (
              <option
                key={approvedRestaurant._id}
                value={approvedRestaurant._id}
              >
                {approvedRestaurant.name}
              </option>
            ))}
          </select>
        </div>

        <SubmitButton text='Schedule' isLoading={isLoading} />
      </form>
    </div>
  );
}
