import SubmitButton from '@components/layout/SubmitButton';
import styles from './ChangePassword.module.css';
import { CustomAxiosError, FormData } from 'types';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';

export default function ChangePassword() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const initialState = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const [formData, setFormData] = useState<FormData>(initialState);

  const { currentPassword, newPassword, confirmNewPassword } = formData;
  const arePasswordsMatched = newPassword === confirmNewPassword;

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

      const response = await axiosInstance.patch('/users/change-password', {
        currentPassword,
        newPassword,
      });

      setFormData(initialState);
      showSuccessAlert(response.data, setAlerts);

      router.push('/profile');
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.container}>
      <p className={styles.title}>Change password</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='currentPassword'>Current password*</label>
          <input
            required
            type='password'
            id='currentPassword'
            value={currentPassword}
            onChange={handleChange}
            placeholder='Type your current password'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='newPassword'>New password*</label>
          <input
            required
            type='password'
            id='newPassword'
            value={newPassword}
            onChange={handleChange}
            placeholder='Type you new password'
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='confirmNewPassword'>
            Confirm new password*{' '}
            {!arePasswordsMatched && " - Passwords don't match"}
          </label>
          <input
            required
            type='password'
            id='confirmNewPassword'
            value={confirmNewPassword}
            onChange={handleChange}
            placeholder='Type your new password again'
          />
        </div>

        <SubmitButton text='Submit' isLoading={isLoading} />
      </form>
    </section>
  );
}
