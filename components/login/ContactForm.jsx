import { useState } from "react";
import { ChangeEvent, FormEvent } from "types";
import styles from "@styles/login/ContactForm.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Destructure form data and check
  // If there is an empty field
  const { email, password } = formData;
  const hasEmpty = Object.values(formData).some((data) => data === "");

  // Handle change
  function handleChange(e) {
    if (!hasEmpty) {
      setDisabled(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);

    setFormData({
      email: "",
      password: "",
    });
  }

  return (
    <section className={styles.contact_form}>
      <p className={styles.title}>Sign in to your account</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={`${styles.button} ${!disabled && styles.active}`}
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
