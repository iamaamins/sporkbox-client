import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { ICompany, IFormData } from "types";
import { axiosInstance } from "@utils/index";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@styles/admin/AddCompany.module.css";
import SubmitButton from "@components/layout/SubmitButton";

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
    address_line_1: "",
    address_line_2: "",
  };

  // Hooks
  const router = useRouter();
  const { setCompanies } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure data
  const {
    name,
    code,
    city,
    state,
    zip,
    website,
    dailyBudget,
    address_line_1,
    address_line_2,
  } = formData;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currData) => ({
      ...currData,
      [id]: id === "dailyBudget" ? +value : value,
    }));
  }

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create a company
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.post(`/companies/add`, formData);

      // New company
      const newCompany = response.data;

      // Update state
      setCompanies((currCompanies: ICompany[]) => [
        ...currCompanies,
        newCompany,
      ]);

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

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            value={website}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="address_line_1">Address line 1</label>
          <input
            type="text"
            id="address_line_1"
            value={address_line_1}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="address_line_2">Address line 2</label>
          <input
            type="text"
            id="address_line_2"
            value={address_line_2}
            onChange={handleChange}
          />
        </div>

        <div className={styles.city_state_zip}>
          <div className={styles.item}>
            <label htmlFor="city">City</label>
            <input type="text" id="city" value={city} onChange={handleChange} />
          </div>

          <div className={styles.item}>
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={handleChange}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor="zip">Zip</label>
            <input type="text" id="zip" value={zip} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.item}>
          <label htmlFor="code">Code</label>
          <input type="text" id="code" value={code} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="dailyBudget">Daily budget</label>
          <input
            type="number"
            id="dailyBudget"
            value={dailyBudget}
            onChange={handleChange}
          />
        </div>

        <SubmitButton text="Add company" isLoading={isLoading} />
      </form>
    </section>
  );
}
