import { useRouter } from 'next/router';
import styles from './AddGuest.module.css';
import { useAlert } from '@context/Alert';
import { ChangeEvent, FormEvent, useState } from 'react';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import SubmitButton from '@components/layout/SubmitButton';
import { useUser } from '@context/User';

export default function AddGuest() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    companyId: '',
  };
  const { customer } = useUser();
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(initialState);

  const { firstName, lastName, email, companyId } = formData;

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

      await axiosInstance.post(`/guests/add/${companyId}`, formData);

      setFormData(initialState);
      showSuccessAlert('Guest added', setAlerts);

      router.push('/company');
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

        <div className={styles.item}>
          <label htmlFor='companyId'>Shift*</label>
          <select id='companyId' value={companyId} onChange={handleChange}>
            <option>Please select a shift</option>
            {customer?.companies.map((company) => (
              <option value={company._id} key={company._id}>
                {`${company.shift
                  .slice(0, 1)
                  .toUpperCase()}${company.shift.slice(1)}`}
              </option>
            ))}
          </select>
        </div>

        <SubmitButton text='Add guest' isLoading={isLoading} />
      </form>
    </section>
  );
}
