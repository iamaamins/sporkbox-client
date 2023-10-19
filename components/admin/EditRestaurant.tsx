import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import RestaurantForm from './RestaurantForm';
import { CustomAxiosError, RestaurantFormData, Vendor } from 'types';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateVendors,
} from '@utils/index';
import styles from '@styles/admin/EditRestaurant.module.css';
import React, { FormEvent, useEffect, useState } from 'react';

export default function EditRestaurant() {
  // Initial state
  const initialState = {
    zip: '',
    city: '',
    logo: '',
    email: '',
    state: '',
    lastName: '',
    firstName: '',
    file: undefined,
    addressLine1: '',
    addressLine2: '',
    restaurantName: '',
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<Vendor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RestaurantFormData>(initialState);

  // Destructure form data
  const {
    zip,
    logo,
    city,
    file,
    email,
    state,
    lastName,
    firstName,
    addressLine1,
    addressLine2,
    restaurantName,
  } = formData;

  // Get the restaurant
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the vendor
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );

      if (vendor) {
        // Update states
        setVendor(vendor);
        setFormData({
          email: vendor.email,
          lastName: vendor.lastName,
          firstName: vendor.firstName,
          logo: vendor.restaurant.logo,
          zip: vendor.restaurant.address.zip,
          city: vendor.restaurant.address.city,
          restaurantName: vendor.restaurant.name,
          state: vendor.restaurant.address.state,
          addressLine1: vendor.restaurant.address.addressLine1,
          addressLine2: vendor.restaurant.address.addressLine2,
        });
      }
    }
  }, [vendors, router.isReady]);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Append the data
    data.append('zip', zip as string);
    data.append('city', city as string);
    data.append('logo', logo as string);
    data.append('email', email as string);
    data.append('state', state as string);
    file && data.append('file', file as File);
    data.append('lastName', lastName as string);
    data.append('firstName', firstName as string);
    data.append('addressLine1', addressLine1 as string);
    data.append('addressLine2', addressLine2 as string);
    data.append('restaurantName', restaurantName as string);

    try {
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const response = await axiosInstance.patch(
        `/vendors/${vendor?._id}/update-vendor-details`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Update vendors
      updateVendors(response.data, setVendors);

      // Show success alert
      showSuccessAlert('Restaurant updated', setAlerts);

      // Push to dashboard
      router.push(`/admin/restaurants/${response.data.restaurant._id}`);
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
    <section className={styles.edit_restaurant}>
      {vendors.isLoading && <h2>Loading...</h2>}

      {!vendors.isLoading && !vendor && <h2>No vendor found</h2>}

      {vendor && (
        <>
          <h2>Edit the details</h2>

          <RestaurantForm
            buttonText='Save'
            formData={formData}
            isLoading={isLoading}
            showPasswordFields={false}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
}
