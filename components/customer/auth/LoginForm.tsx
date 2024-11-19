import Link from 'next/link';
import { useUser } from '@context/User';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData } from 'types';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './LoginForm.module.css';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';

const initialSate = {
  email: '',
  password: '',
};

export default function LoginForm() {
  const { setAlerts } = useAlert();
  const { setAdmin, setVendor, setCustomer } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialSate);

  const { email, password } = formData;

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
      const response = await axiosInstance.post(`/users/login`, formData);
      setFormData({
        email: '',
        password: '',
      });

      if (response.data.role === 'ADMIN') setAdmin(response.data);
      if (response.data.role === 'VENDOR') setVendor(response.data);
      if (response.data.role === 'CUSTOMER') setCustomer(response.data);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.login_form}>
      <p className={styles.title}>Sign in to your account</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='email'>Your email</label>
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

        <SubmitButton text='Sign in' isLoading={isLoading} />
      </form>

      <div className={styles.actions}>
        <p>
          Don&apos;t have an account? Register{' '}
          <Link href='/register'>
            <a>here</a>
          </Link>
        </p>
        <p>
          Forgot password? Reset{' '}
          <Link href='/forgot-password'>
            <a>here</a>
          </Link>
        </p>
      </div>
    </section>
  );
}
