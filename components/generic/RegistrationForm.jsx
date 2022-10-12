import { useState } from "react";
import axios from "axios";
import { useUser } from "@context/User";
import { hasEmpty } from "@utils/index";
import styles from "@styles/generic/RegistrationForm.module.css";
import ActionButton from "@components/layout/ActionButton";
import Link from "next/link";

export default function RegistrationForm() {
  const initialSate = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { setUser } = useUser();
  const [formData, setFormData] = useState(initialSate);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Destructure form data and check
  // If there is an empty field
  const { name, email, password, confirmPassword } = formData;

  // Handle change
  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setIsDisabled(false);
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
      // Show the loader
      setIsLoading(true);

      // Make the request to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/register`,
        formData,
        {
          withCredentials: true,
        }
      );

      // Update state
      setUser(res.data);

      // Remove the loader and clear form
      setIsLoading(false);
      setFormData(initialSate);
    } catch (err) {
      // Remove the loader
      setIsLoading(false);
      console.log(err.response);
    }
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

        <ActionButton
          text="Create account"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </form>

      <p className={styles.action}>
        Already have an account? Sign in{" "}
        <Link href="/login">
          <a>here</a>
        </Link>
      </p>
    </section>
  );
}
