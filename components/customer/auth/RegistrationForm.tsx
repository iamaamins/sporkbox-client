import Link from 'next/link';
import { useUser } from '@context/User';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData } from 'types';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import styles from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const initialSate = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyCode: '',
    confirmPassword: '',
  };
  const { setAlerts } = useAlert();
  const { setCustomer } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialSate);

  const { firstName, lastName, email, password, companyCode, confirmPassword } =
    formData;
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
      const response = await axiosInstance.post(
        `/customers/register`,
        formData
      );

      setFormData(initialSate);
      setCustomer(response.data);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.registration_form}>
      <p className={styles.title}>Create your account</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='firstName'>First name*</label>
          <input
            required
            type='text'
            id='firstName'
            value={firstName}
            onChange={handleChange}
            placeholder='Type your first name'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='lastName'>Last name*</label>
          <input
            required
            type='text'
            id='lastName'
            value={lastName}
            onChange={handleChange}
            placeholder='Type your last name'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='email'>Email*</label>
          <input
            required
            type='email'
            id='email'
            value={email}
            onChange={handleChange}
            placeholder='Type your email address'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='companyCode'>Company code*</label>
          <input
            required
            type='text'
            id='companyCode'
            value={companyCode}
            onChange={handleChange}
            placeholder='Type your company code'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='password'>Password*</label>
          <input
            required
            type='password'
            id='password'
            value={password}
            onChange={handleChange}
            placeholder='Type your password'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='confirmPassword'>
            Confirm password* {!passwordsMatch && " - Passwords don't match"}
          </label>
          <input
            required
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={handleChange}
            placeholder='Type your password again'
          />
        </div>

        <SubmitButton text='Create account' isLoading={isLoading} />
      </form>

      <p className={styles.action}>
        Already have an account? Sign in{' '}
        <Link href='/login'>
          <a>here</a>
        </Link>
      </p>
    </section>
  );
}
