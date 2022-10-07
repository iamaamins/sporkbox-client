import { useState } from "react";
import axios from "axios";
import { useUser } from "@context/user";
import { hasEmpty } from "@utils/index";
import styles from "@styles/generic/RegistrationForm.module.css";

export default function RegistrationForm() {
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Destructure form data and check
  // If there is an empty field
  const { name, email, password, confirmPassword } = formData;

  // Handle change
  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setDisabled(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/register`,
        formData,
        {
          withCredentials: true,
        }
      );

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }

    // setFormData({
    //   name: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    // });
  }

  return (
    <section className={styles.registration_form}>
      <p className={styles.title}>Create your account</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" value={name} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="email">Company email</label>
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

        <div className={styles.item}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={`${styles.button} ${!disabled && styles.active}`}
        >
          Create account
        </button>
      </form>
    </section>
  );
}
