import { ICompany, IFormData } from "types";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/EditCompany.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import CompanyForm from "./CompanyForm";
import { axiosInstance } from "@utils/index";

export default function EditCompany() {
  // Initial state
  const initialState = {
    name: "",
    code: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    dailyBudget: 0,
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { companies, setCompanies } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<ICompany>();
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Get the company
  useEffect(() => {
    if (companies.data.length > 0 && router.isReady) {
      // Find the company
      const company = companies.data.find(
        (company) => company._id === router.query.company
      );

      // Update company state
      setCompany(company);

      // Update form data
      setFormData((currState) => {
        if (company) {
          return {
            ...currState,
            name: company.name,
            code: company.code,
            city: company.address.split(",")[2],
            state: company.address.split(",")[3].trim().split(" ")[0],
            zip: company.address.split(",")[3].trim().split(" ")[1],
            website: company.website,
            dailyBudget: company.dailyBudget,
            addressLine1: company.address.split(",")[0],
            addressLine2: company.address.split(",")[1],
          };
        } else {
          return currState;
        }
      });
    }
  }, [companies, router.isReady]);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create a company
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.put(
        `/companies/${company?._id}/update`,
        formData
      );

      // Update companies
      setCompanies((currState) => ({
        ...currState,
        data: [
          ...currState.data.filter(
            (company) => company._id !== response.data._id
          ),
          response.data,
        ],
      }));

      // Clear the form
      setFormData(initialState);

      // Push to dashboard
      router.push(`/admin/companies/${response.data._id}`);
    } catch (err) {
      console.log(err);
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
            isLoading={isLoading}
            formData={formData}
            buttonText="Save"
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
}
