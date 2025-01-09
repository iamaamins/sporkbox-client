import { useRouter } from 'next/router';
import styles from './AddGuest.module.css';
import GuestForm from './GuestForm';
import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import { FormEvent, useState } from 'react';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import { CustomAxiosError, GuestFormData } from 'types';

export default function AddGuest() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
  };
  const router = useRouter();
  const { setAlerts } = useAlert();
  const {} = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<GuestFormData>(initialState);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      await axiosInstance.post(`/guests/add-guest`, {
        ...formData,
        companyId: router.query.company,
      });

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
      <GuestForm
        formData={formData}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText='Add guest'
        setFormData={setFormData}
      />
    </section>
  );
}
