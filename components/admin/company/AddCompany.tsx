import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import CompanyForm from './CompanyForm';
import { FormEvent, useState } from 'react';
import { CustomAxiosError, CompanyFormData } from 'types';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateCompanies,
} from '@lib/utils';
import styles from './AddCompany.module.css';

export default function AddCompany() {
  const initialState = {
    zip: '',
    name: '',
    code: '',
    city: '',
    state: '',
    shift: '',
    website: '',
    shiftBudget: 0,
    addressLine1: '',
    addressLine2: '',
    slackChannel: '',
  };
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setCompanies } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyFormData>(initialState);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/companies/add-company`,
        formData
      );
      updateCompanies(response.data, setCompanies);
      setFormData(initialState);
      showSuccessAlert('Company added', setAlerts);
      router.push('/admin/companies');
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.container}>
      <h2>Add a company</h2>
      <CompanyForm
        formData={formData}
        isLoading={isLoading}
        buttonText='Add company'
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        showShiftAndCodeField={true}
      />
    </section>
  );
}
