import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { IFormData } from "types";
import CompanyForm from "./CompanyForm";
import { FormEvent, useState } from "react";
import styles from "@styles/admin/AddCompany.module.css";
import { axiosInstance, updateCompanies } from "@utils/index";

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

      // Push to dashboard
      router.push("/admin/companies");
    } catch (err) {
      console.log(err);
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
