import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import CompanyForm from './CompanyForm';
import { useAlert } from '@context/Alert';
import styles from './EditCompany.module.css';
import { CustomAxiosError, Company, CompanyFormData } from 'types';
import React, { FormEvent, useEffect, useState } from 'react';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateCompanies,
} from '@lib/utils';

export default function EditCompany() {
  const initialState = {
    name: '',
    city: '',
    state: '',
    zip: '',
    website: '',
    shiftBudget: 0,
    addressLine1: '',
    addressLine2: '',
    slackChannel: '',
  };
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { companies, setCompanies } = useData();
  const [company, setCompany] = useState<Company>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyFormData>(initialState);

  useEffect(() => {
    if (companies.data.length > 0 && router.isReady) {
      const company = companies.data.find(
        (company) => company._id === router.query.company
      );

      if (company) {
        setCompany(company);
        setFormData({
          name: company.name,
          zip: company.address.zip,
          website: company.website,
          city: company.address.city,
          state: company.address.state,
          shiftBudget: company.shiftBudget,
          addressLine1: company.address.addressLine1,
          addressLine2: company.address.addressLine2,
          slackChannel: company.slackChannel,
        });
      }
    }
  }, [companies, router.isReady]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axiosInstance.patch(
        `/companies/${company?._id}/update`,
        formData
      );

      updateCompanies(response.data, setCompanies);
      showSuccessAlert('Company updated', setAlerts);

      router.push(`/admin/companies/${response.data._id}`);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.edit_company}>
      {companies.isLoading && <h2>Loading...</h2>}
      {!companies.isLoading && !company && <h2>No company found</h2>}
      {company && (
        <>
          <h2>Edit the details</h2>
          <CompanyForm
            buttonText='Save'
            formData={formData}
            isLoading={isLoading}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            showShiftAndCodeField={false}
          />
        </>
      )}
    </section>
  );
}
