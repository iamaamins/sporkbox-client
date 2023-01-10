import Link from "next/link";
import { IFormData } from "types";
import { useUser } from "@context/User";
import { axiosInstance } from "@utils/index";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@styles/generic/LoginForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";

export default function LoginForm() {
  const initialSate = {
    email: "",
    password: "",
  };
  // Hooks
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialSate);

  // Destructure form data and check
  // If there is an empty field
  const { email, password } = formData;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // Update state
    setFormData((currState) => ({
      ...currState,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show the loader
      setIsLoading(true);

      // Fetch data
      const response = await axiosInstance.post(`/users/login`, formData);

      // Update state
      setUser(response.data);

      // Clear form data
      setFormData({
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
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

        <SubmitButton text="Sign in" isLoading={isLoading} />
      </form>

      <div className={styles.actions}>
        <p>
          Don&apos;t have an account? Register{" "}
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
