import { useState } from "react";
import { hasEmpty } from "@utils/index";
import styles from "@styles/admin/AddCompany.module.css";

export default function AddCompany() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    budget: "",
  });
  const [disabled, setDisabled] = useState(true);

  const { name, code, budget } = formData;

  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setDisabled(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);
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
          <label htmlFor="code">Code</label>
          <input type="text" id="code" value={code} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="budget">Budget</label>
          <input
            type="budget"
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
