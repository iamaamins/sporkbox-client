import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import styles from './FoodPreferences.module.css';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useUser } from '@context/User';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import SubmitButton from '@components/layout/SubmitButton';
import { useData } from '@context/Data';

type Props = {
  setShowFoodPreferencesModal: Dispatch<SetStateAction<boolean>>;
};

export default function FoodPreferences({
  setShowFoodPreferencesModal,
}: Props) {
  const { setAlerts } = useAlert();
  const { dietaryTags } = useData();
  const { customer, setCustomer } = useUser();
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const [preferences, setPreferences] = useState<string[]>([]);

  function handlePreferencesChange(e: ChangeEvent<HTMLInputElement>) {
    setPreferences((prevState) =>
      e.target.checked
        ? [...prevState, e.target.id]
        : prevState.filter((el) => el !== e.target.id)
    );
  }

  async function savePreferences(e: FormEvent) {
    e.preventDefault();
    if (!customer) return;

    try {
      setIsUpdatingPreferences(true);
      const response = await axiosInstance.patch(
        `/customers/${customer._id}/update-food-preferences`,
        { preferences }
      );
      setCustomer(
        (prevState) =>
          prevState && {
            ...prevState,
            foodPreferences: response.data.foodPreferences,
          }
      );
      setShowFoodPreferencesModal(false);
      showSuccessAlert('Preferences updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingPreferences(false);
    }
  }

  useEffect(() => {
    if (customer && customer.foodPreferences)
      setPreferences(customer.foodPreferences);
  }, [customer]);

  return (
    <div className={styles.container}>
      <h2>Food preferences</h2>
      <form onSubmit={savePreferences}>
        <div className={styles.tags}>
          {dietaryTags.data.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <input
                id={tag}
                type='checkbox'
                onChange={handlePreferencesChange}
                checked={preferences.includes(tag)}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <SubmitButton text='Save' isLoading={isUpdatingPreferences} />
      </form>
    </div>
  );
}
