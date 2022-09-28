import { useState } from "react";
import axios from "axios";
import { API_URL } from "@utils/index";
import { useAdmin } from "@context/admin";
import { useLoader } from "@context/loader";
import styles from "@styles/admin/login/LoginForm.module.css";

export default function LoginForm() {
  // Hooks
  const { setAdmin } = useAdmin();
  const { setLoading } = useLoader();

  // States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(true);

  // Destructure form data and check
  // If there is an empty field
  const { email, password } = formData;
  const hasEmpty = Object.values(formData).some((data) => data === "");

  // Handle change
  function handleChange(e) {
    if (!hasEmpty) {
      setDisabled(false);
    }

    // Update state
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Show the loader
      setLoading(true);

      // Fetch data
      const res = await axios.post(`${API_URL}/admin/login`, formData, {
        withCredentials: true,
      });

      // Update state
      setAdmin(res.data);

      // Clear form data
      setFormData({
        email: "",
        password: "",
      });

      // Remove the loader
      setLoading(false);
    } catch (err) {
      console.log(err);

      // Remove the loader
      setLoading(false);
    }
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
