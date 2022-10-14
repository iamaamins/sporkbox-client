import axios from "axios";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { hasEmpty } from "@utils/index";
import { ICompany, IFormData } from "types";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@styles/admin/AddCompany.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function AddCompany() {
  // Initial state
  const initialState = {
    name: "",
    code: "",
    budget: 0,
    address: "",
    website: "",
  };

  // Hooks
  const router = useRouter();
  const { setCompanies } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure data
  const { name, website, address, code, budget } = formData;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
  async function handleSubmit(e: FormEvent) {
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
      setCompanies((currCompanies: ICompany[]) => [
        ...currCompanies,
        newCompany,
      ]);

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
