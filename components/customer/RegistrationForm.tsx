import Link from 'next/link';
import { useUser } from '@context/User';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, IFormData } from 'types';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import styles from './RegistrationForm.module.css';

const initialSate = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  companyCode: '',
  confirmPassword: '',
};

export default function RegistrationForm() {
  const { setAlerts } = useAlert();
  const { setCustomer } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialSate);

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
        `/customers/register-customer`,
        formData
      );
      setFormData(initialSate);
      setCustomer(response.data);
    } catch (err) {
      console.log(err);
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
          <label htmlFor='companyCode'>Company code</label>
          <input
            type='text'
            id='companyCode'
            value={companyCode}
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
