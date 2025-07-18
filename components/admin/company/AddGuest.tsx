import { useRouter } from 'next/router';
import styles from './AddGuest.module.css';
import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import { ChangeEvent, FormEvent, useState } from 'react';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import SubmitButton from '@components/layout/SubmitButton';

export default function AddGuest() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
  };
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setGuests } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(initialState);

  const { firstName, lastName, email } = formData;

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
        `/guests/add/${router.query.company}`,
        formData
      );

      setGuests((prevState) => ({
        ...prevState,
        data: [...prevState.data, response.data],
      }));

      setFormData(initialState);
      showSuccessAlert('Guest added', setAlerts);

      router.push(`/admin/companies/${router.query.company}`);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.container}>
      <h2>Add a guest</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='firstName'>First name*</label>
          <input
            type='text'
            id='firstName'
            required
            value={firstName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='lastName'>Last name*</label>
          <input
            type='text'
            id='lastName'
            required
            value={lastName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='email'>Email*</label>
          <input
            type='email'
            required
            id='email'
            value={email}
            onChange={handleChange}
          />
        </div>

        <SubmitButton text='Add guest' isLoading={isLoading} />
      </form>
    </section>
  );
}
