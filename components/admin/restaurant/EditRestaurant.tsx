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
} from '@lib/utils';
import styles from './EditRestaurant.module.css';
import React, { FormEvent, useEffect, useState } from 'react';

export default function EditRestaurant() {
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
    orderCapacity: '',
    isFeatured: false,
    restaurantName: '',
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<Vendor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RestaurantFormData>(initialState);

  const {
    zip,
    logo,
    city,
    file,
    email,
    state,
    lastName,
    firstName,
    isFeatured,
    addressLine1,
    addressLine2,
    orderCapacity,
    restaurantName,
  } = formData;

  // Get the restaurant
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );

      if (vendor) {
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
          isFeatured: vendor.restaurant.isFeatured,
          addressLine1: vendor.restaurant.address.addressLine1,
          addressLine2: vendor.restaurant.address.addressLine2,
          orderCapacity:
            vendor.restaurant.orderCapacity === null
              ? ''
              : vendor.restaurant.orderCapacity.toString(),
        });
      }
    }
  }, [vendors, router.isReady]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = new FormData();

    data.append('zip', zip);
    data.append('city', city);
    data.append('email', email);
    data.append('state', state);
    file && data.append('file', file);
    data.append('logo', logo as string);
    data.append('lastName', lastName);
    data.append('firstName', firstName);
    data.append('addressLine1', addressLine1);
    data.append('restaurantName', restaurantName);
    data.append('addressLine2', addressLine2 as string);
    data.append('isFeatured', JSON.stringify(isFeatured));
    orderCapacity && data.append('orderCapacity', orderCapacity);

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/vendors/${vendor?._id}/update`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      updateVendors(response.data, setVendors);
      showSuccessAlert('Restaurant updated', setAlerts);
      router.push(`/admin/restaurants/${response.data.restaurant._id}`);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
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
