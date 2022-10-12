import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import ButtonLoader from "@components/layout/ButtonLoader";
import { hasEmpty } from "@utils/index";
import styles from "@styles/admin/AddCompany.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function AddCompany() {
  // Initial state
  const initialState = {
    name: "",
    website: "",
    address: "",
    code: "",
    budget: 0,
  };

  // Hooks
  const router = useRouter();
  const { setCompanies } = useData();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Destructure data
  const { name, website, address, code, budget } = formData;

  // Handle change
  function handleChange(e) {
    // Check if any field is empty
    if (!hasEmpty(formData)) {
      setIsDisabled(false);
    }

    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currData) => ({
      ...currData,
      [id]: id === "budget" ? +value : value,
    }));
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    // Create a company
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/add`,
        formData,
        {
          withCredentials: true,
        }
      );

      // New company
      const newCompany = res.data;

      // Update state
      setCompanies((prevCompanies) => [...prevCompanies, newCompany]);

      // Clear the form
      setFormData(initialState);

      // Update states
      setIsLoading(false);
      setIsDisabled(true);

      // Push to dashboard
      router.push("/admin/companies");
    } catch (err) {
      // Remove loader
      setIsLoading(false);
      console.log(err);
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
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="code">Code</label>
          <input type="text" id="code" value={code} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={handleChange}
          />
        </div>

        <ActionButton
          text="Add company"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </form>
    </section>
  );
}
