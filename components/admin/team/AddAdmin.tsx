import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData } from 'types';
import styles from './AddAdmin.module.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import { useRouter } from 'next/router';

export default function AddAdmin() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  const { firstName, lastName, email, role, password, confirmPassword } =
    formData;
  const passwordsMatch = password === confirmPassword;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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

      router.push('/admin/team');
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_admin}>
      <h2>Add admin</h2>

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
          <label htmlFor='role'>Role</label>
          <select id='role' value={role} onChange={handleChange}>
            <option value='please select a role'>Please select a role</option>
            <option value='ADMIN'>Admin</option>
            <option value='DRIVER'>Delivery Driver</option>
          </select>
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
