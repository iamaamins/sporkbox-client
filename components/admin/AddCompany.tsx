import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { AxiosError } from "axios";
import CompanyForm from "./CompanyForm";
import { FormEvent, useState } from "react";
import { IAxiosError, IFormData } from "types";
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateCompanies,
} from "@utils/index";
import styles from "@styles/admin/AddCompany.module.css";

export default function AddCompany() {
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
  const { setAlerts } = useAlert();
  const { setCompanies } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.post(
        `/companies/add-company`,
        formData
      );

      // Update companies
      updateCompanies(response.data, setCompanies);

      // Clear the form
      setFormData(initialState);

      // Show success alert
      showSuccessAlert("Company added", setAlerts);

      // Push to dashboard
      router.push("/admin/companies");
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_company}>
      <h2>Add a company</h2>

      <CompanyForm
        isLoading={isLoading}
        formData={formData}
        setFormData={setFormData}
        buttonText="Add company"
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
