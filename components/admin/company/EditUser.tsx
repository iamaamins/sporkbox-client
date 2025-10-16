import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData, Customer, Guest } from 'types';
import styles from './EditUser.module.css';
import SubmitButton from '@components/layout/SubmitButton';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

export default function EditUser() {
  const initialState = {
    email: '',
    lastName: '',
    firstName: '',
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, guests, setCustomers, setGuests } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Customer | Guest>();
  const [formData, setFormData] = useState<FormData>(initialState);

  const { firstName, lastName, email } = formData;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axiosInstance.patch(
        `/users/${router.query.user}/update`,
        formData
      );

      if (response.data.role === 'CUSTOMER') {
        setCustomers((prevState) => ({
          ...prevState,
          data: prevState.data.map((customer) => {
            if (customer._id !== response.data._id) return customer;
            return {
              ...customer,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
            };
          }),
        }));
      }

      if (response.data.role === 'GUEST') {
        setGuests((prevState) => ({
          ...prevState,
          data: prevState.data.map((guest) => {
            if (guest._id !== response.data._id) return guest;
            return {
              ...guest,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
            };
          }),
        }));
      }

      showSuccessAlert('User updated', setAlerts);
      router.push(`/admin/companies/${router.query.company}`);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  // Get user
  useEffect(() => {
    if (
      router.isReady &&
      (customers.data.length > 0 || guests.data.length > 0)
    ) {
      const user = [...customers.data, ...guests.data].find(
        (user) => user._id === router.query.user
      );

      if (user) {
        setUser(user);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    }
  }, [customers, guests, router.isReady]);

  return (
    <section className={styles.container}>
      {(customers.isLoading || guests.isLoading) && <h2>Loading...</h2>}
      {!customers.isLoading && !guests.isLoading && !user && (
        <h2>No User found</h2>
      )}
      {user && (
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
