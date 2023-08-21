import Link from 'next/link';
import { CustomAxiosError } from 'types';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import styles from '@styles/generic/ForgotPassword.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@utils/index';

export default function ForgotPassword() {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show the loader
      setIsLoading(true);

      // Make request to the backend
      const response = await axiosInstance.post(`/users/forgot-password`, {
        email,
      });

      // Clear form data
      setEmail('');

      // Show success alert
      showSuccessAlert(response.data, setAlerts);

      // Push to home page
      router.push('/');
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
    <section className={styles.forgot_password}>
      <p className={styles.title}>Forgot password?</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='email'>Your email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
