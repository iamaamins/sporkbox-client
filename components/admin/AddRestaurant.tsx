import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import { FormEvent, useState } from 'react';
import RestaurantForm from './RestaurantForm';
import { CustomAxiosError, RestaurantFormData } from 'types';
import styles from '@styles/admin/AddRestaurant.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@utils/index';

export default function AddRestaurant() {
  // Initial state
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
    restaurantName: '',
    confirmPassword: '',
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RestaurantFormData>(initialState);

  // Destructure form data
  const {
    zip,
    city,
    file,
    state,
    email,
    lastName,
    password,
    firstName,
    addressLine1,
    addressLine2,
    restaurantName,
  } = formData;

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Append the data
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
    data.append('restaurantName', restaurantName as string);

    try {
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const response = await axiosInstance.post(`/vendors/add-vendor`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update state
      setVendors((prevState) => ({
        ...prevState,
        data: [...prevState.data, response.data],
      }));

      // Reset form data
      setFormData(initialState);

      // Show success alert
      showSuccessAlert('Restaurant added', setAlerts);

      // Push to dashboard
      router.push('/admin/restaurants');
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove loader
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
