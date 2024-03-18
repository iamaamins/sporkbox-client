import Link from 'next/link';
import { CustomAxiosError } from 'types';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import styles from './ForgotPassword.module.css';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

export default function ForgotPassword() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/users/forgot-password`, {
        email,
      });
      setEmail('');
      showSuccessAlert(response.data, setAlerts);
      router.push('/');
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
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
