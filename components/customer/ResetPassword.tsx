import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData } from 'types';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import styles from './ResetPassword.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

const initialState = {
  password: '',
  confirmPassword: '',
};

export default function ResetPassword() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  const { password, confirmPassword } = formData;
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
      const response = await axiosInstance.patch(
        `/users/reset-password/${router.query.user}/${router.query.token}`,
        { password }
      );
      setFormData(initialState);
      showSuccessAlert(response.data, setAlerts);
      router.push('/login');
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.reset_password}>
      <p className={styles.title}>Reset password?</p>
      <form onSubmit={handleSubmit}>
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

        <SubmitButton text='Submit' isLoading={isLoading} />
      </form>

      <div className={styles.actions}>
        <p>
          Don&apos;t have an account? Register{' '}
          <Link href='/register'>
            <a>here</a>
          </Link>
        </p>

        <p>
          Have the password? Sign in{' '}
          <Link href='/login'>
            <a>here</a>
          </Link>
        </p>
      </div>
    </section>
  );
}
