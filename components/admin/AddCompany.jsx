import { useState } from "react";
import { API_URL, hasEmpty } from "@utils/index";
import styles from "@styles/admin/AddCompany.module.css";
import axios from "axios";

export default function AddCompany() {
  // Initial state
  const initialState = {
    name: "",
    website: "",
    code: "",
    budget: "",
  };
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState(initialState);

  const { name, website, code, budget } = formData;

  function handleChange(e) {
    // Check if any field is empty
    if (!hasEmpty(formData)) {
      setDisabled(false);
    }

    // update state
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/company/register`, formData, {
        withCredentials: true,
      });

      console.log(res);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  return (
    <section className={styles.add_company}>
      <p className={styles.title}>Add a company</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="code">Website</label>
          <input
            type="text"
            id="website"
            value={website}
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
            type="text"
            id="budget"
            value={budget}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={`${styles.button} ${!disabled && styles.active}`}
        >
          Add Company
        </button>
      </form>
    </section>
  );
}
