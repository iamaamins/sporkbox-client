import { AxiosError } from "axios";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import CompanyForm from "./CompanyForm";
import { useAlert } from "@context/Alert";
import styles from "@styles/admin/EditCompany.module.css";
import { IAxiosError, ICompany, ICompanyFormData } from "types";
import React, { FormEvent, useEffect, useState } from "react";
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateCompanies,
} from "@utils/index";

export default function EditCompany() {
  // Initial state
  const initialState = {
    name: "",
    code: "",
    city: "",
    state: "",
    zip: "",
    shift: "",
    website: "",
    shiftBudget: 0,
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { companies, setCompanies } = useData();
  const [company, setCompany] = useState<ICompany>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ICompanyFormData>(initialState);

  // Get the company
  useEffect(() => {
    if (companies.data.length > 0 && router.isReady) {
      // Find the company
      const company = companies.data.find(
        (company) => company._id === router.query.company
      );

      if (company) {
        // Update states
        setCompany(company);
        setFormData({
          name: company.name,
          code: company.code,
          shift: company.shift,
          zip: company.address.zip,
          website: company.website,
          city: company.address.city,
          state: company.address.state,
          shiftBudget: company.shiftBudget,
          addressLine1: company.address.addressLine1,
          addressLine2: company.address.addressLine2,
        });
      }
    }
  }, [companies, router.isReady]);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.patch(
        `/companies/${company?._id}/update-company-details`,
        formData
      );

      // Update companies
      updateCompanies(response.data, setCompanies);

      // Show success alert
      showSuccessAlert("Company updated", setAlerts);

      // Push to dashboard
      router.push(`/admin/companies/${response.data._id}`);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader
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
            buttonText="Save"
            formData={formData}
            isLoading={isLoading}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
}
