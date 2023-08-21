import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, IFormData } from 'types';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import styles from '@styles/generic/ResetPassword.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@utils/index';

export default function ResetPassword() {
  // Initial state
  const initialState = {
    password: '',
    confirmPassword: '',
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure data
  const { password, confirmPassword } = formData;

  // Check password match
  const passwordsMatch = password === confirmPassword;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
        `/users/reset-password/${router.query.user}/${router.query.token}`,
        { password }
      );

      // Clear form data
      setFormData(initialState);

      // Show success alert
      showSuccessAlert(response.data, setAlerts);

      // Push to login page
      router.push('/login');
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
