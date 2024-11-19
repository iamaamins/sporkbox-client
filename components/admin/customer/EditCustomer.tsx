import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData, Customer } from 'types';
import styles from './EditCustomer.module.css';
import SubmitButton from '@components/layout/SubmitButton';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateCustomers,
} from '@lib/utils';

export default function EditCustomer() {
  // Initial state
  const initialState = {
    email: '',
    lastName: '',
    firstName: '',
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, setCustomers } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer>();
  const [formData, setFormData] = useState<FormData>(initialState);

  // Destructure form data
  const { firstName, lastName, email } = formData;

  // Get customer
  useEffect(() => {
    if (customers.data.length > 0 && router.isReady) {
      // Get customer
      const customer = customers.data.find(
        (customer) => customer._id === router.query.customer
      );

      if (customer) {
        // Update states
        setCustomer(customer);
        setFormData({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        });
      }
    }
  }, [customers, router.isReady]);

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // Update state
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show the loader
      setIsLoading(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/customers/${router.query.customer}/update-customer-details`,
        formData
      );

      // Update customers
      updateCustomers(response.data, setCustomers);

      // Show success alert
      showSuccessAlert('Customer updated', setAlerts);

      // Redirect to the company page
      router.push(`/admin/companies/${router.query.company}`);
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
    <section className={styles.edit_customer}>
      {customers.isLoading && <h2>Loading...</h2>}
      {!customers.isLoading && !customer && <h2>No vendor found</h2>}
      {customer && (
        <>
          <h2>Edit the details</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.item}>
              <label htmlFor='firstName'>First name</label>
              <input
                type='text'
                id='firstName'
                value={firstName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.item}>
              <label htmlFor='lastName'>Last name</label>
              <input
                type='text'
                id='lastName'
                value={lastName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.item}>
              <label htmlFor='email'>Email address</label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={handleChange}
              />
            </div>
            <SubmitButton text='Save' isLoading={isLoading} />
          </form>
        </>
      )}
    </section>
  );
}
