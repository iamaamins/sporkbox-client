import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { AxiosError } from "axios";
import CompanyForm from "./CompanyForm";
import { FormEvent, useState } from "react";
import { IAxiosError, ICompanyFormData } from "types";
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
    zip: "",
    name: "",
    code: "",
    city: "",
    state: "",
    shift: "",
    website: "",
    shiftBudget: 0,
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setCompanies } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ICompanyFormData>(initialState);

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
      // Log error
      console.log(err);

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
        formData={formData}
        isLoading={isLoading}
        buttonText="Add company"
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        showShiftAndCodeField={true}
      />
    </section>
  );
}
