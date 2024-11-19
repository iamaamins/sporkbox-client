import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData } from 'types';
import styles from './AddAdmin.module.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

export default function AddAdmin() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  const { firstName, lastName, email, password, confirmPassword } = formData;
  const passwordsMatch = password === confirmPassword;

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
      await axiosInstance.post('/admins/add-admin', formData);
      setFormData(initialState);
      showSuccessAlert('Admin added', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section className={styles.add_admin}>
      <h2>Add an admin</h2>

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
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='confirmPassword'>
            Confirm password {!passwordsMatch && " - Passwords don't match"}
          </label>
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>

        <SubmitButton isLoading={isLoading} text='Add admin' />
      </form>
    </section>
  );
}
