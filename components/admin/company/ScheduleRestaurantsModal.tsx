import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import SubmitButton from '../../layout/SubmitButton';
import { CustomAxiosError, Restaurant } from 'types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './ScheduleRestaurantsModal.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

type InitialState = {
  date: string;
  restaurantIds: string[];
};

export default function ScheduleRestaurantsModal() {
  const initialState: InitialState = {
    date: '',
    restaurantIds: [],
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setScheduledRestaurants } = useData();
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (vendors.data.length > 0) {
      setRestaurants(
        vendors.data
          .filter((vendor) => vendor.status === 'ACTIVE')
          .map((vendor) => vendor.restaurant)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    }
  }, [vendors]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { id, value, checked } = e.target;
    if (id === 'date') {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        restaurantIds: checked
          ? [...prevState.restaurantIds, value]
          : prevState.restaurantIds.filter(
              (restaurantId) => restaurantId != value
            ),
      }));
    }
  }

  async function scheduleRestaurant(e: FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = { ...formData, companyId: router.query.company };
      const response = await axiosInstance.post(
        '/restaurants/schedule-restaurants',
        data
      );
      setScheduledRestaurants((prevState) => ({
        ...prevState,
        data: [...prevState.data, ...response.data],
      }));
      setFormData(initialState);
      showSuccessAlert('Restaurants scheduled', setAlerts);
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
        <div className={styles.date}>
          <label htmlFor='date'>Select a date</label>
          <input
            id='date'
            type='date'
            min={minDate}
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        {formData.date && (
          <div className={styles.restaurants}>
            <p>Select restaurants</p>
            <div className={styles.restaurant_names}>
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className={styles.restaurant}>
                  <input
                    type='checkbox'
                    id={restaurant._id}
                    value={restaurant._id}
                    onChange={handleChange}
                  />
                  <label htmlFor={restaurant._id}>{restaurant.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        <SubmitButton text='Schedule' isLoading={isLoading} />
      </form>
    </div>
  );
}
