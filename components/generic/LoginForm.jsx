import { useState } from "react";
import axios from "axios";
import { hasEmpty } from "@utils/index";
import { useUser } from "@context/User";
import styles from "@styles/generic/LoginForm.module.css";
import ButtonLoader from "@components/layout/ButtonLoader";
import ActionButton from "@components/layout/ActionButton";
import Link from "next/link";

export default function LoginForm() {
  // Hooks
  const { setUser } = useUser();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Destructure form data and check
  // If there is an empty field
  const { email, password } = formData;

  // Handle change
  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setIsDisabled(false);
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
      setIsLoading(true);

      // Fetch data
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      // Update state
      setUser(res.data);

      // Clear form data
      setFormData({
        email: "",
        password: "",
      });

      // Remove the loader
      setIsLoading(false);
    } catch (err) {
      console.log(err);

      // Remove the loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.login_form}>
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

        <ActionButton
          text="Sign in"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </form>

      <div className={styles.actions}>
        <p>
          Don't have an account? Register{" "}
          <Link href="/register">
            <a>here</a>
          </Link>
        </p>
        <p>
          Forgot password? Reset{" "}
          <Link href="/forgot-password">
            <a>here</a>
          </Link>
        </p>
      </div>
    </section>
  );
}
