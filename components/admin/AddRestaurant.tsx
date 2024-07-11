import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import { FormEvent, useState } from 'react';
import RestaurantForm from './RestaurantForm';
import { CustomAxiosError, RestaurantFormData } from 'types';
import styles from './AddRestaurant.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

export default function AddRestaurant() {
  const initialState = {
    zip: '',
    email: '',
    city: '',
    state: '',
    lastName: '',
    password: '',
    firstName: '',
    file: undefined,
    addressLine1: '',
    addressLine2: '',
    isFeatured: false,
    restaurantName: '',
    confirmPassword: '',
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RestaurantFormData>(initialState);

  const {
    zip,
    city,
    file,
    state,
    email,
    lastName,
    password,
    firstName,
    isFeatured,
    addressLine1,
    addressLine2,
    restaurantName,
  } = formData;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = new FormData();

    data.append('file', file as File);
    data.append('zip', zip as string);
    data.append('city', city as string);
    data.append('email', email as string);
    data.append('state', state as string);
    data.append('lastName', lastName as string);
    data.append('password', password as string);
    data.append('firstName', firstName as string);
    data.append('addressLine1', addressLine1 as string);
    data.append('addressLine2', addressLine2 as string);
    data.append('isFeatured', JSON.stringify(isFeatured));
    data.append('restaurantName', restaurantName as string);

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/vendors/add-vendor`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVendors((prevState) => ({
        ...prevState,
        data: [...prevState.data, response.data],
      }));

      setFormData(initialState);
      showSuccessAlert('Restaurant added', setAlerts);
      router.push('/admin/restaurants');
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_restaurant}>
      <h2>Add a restaurant</h2>
      <RestaurantForm
        formData={formData}
        isLoading={isLoading}
        showPasswordFields={true}
        setFormData={setFormData}
        buttonText='Add restaurant'
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
