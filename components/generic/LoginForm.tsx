import Link from "next/link";
import { AxiosError } from "axios";
import { useUser } from "@context/User";
import { useAlert } from "@context/Alert";
import { IAxiosError, IFormData } from "types";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@styles/generic/LoginForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import { axiosInstance, showErrorAlert } from "@utils/index";

export default function LoginForm() {
  const initialSate = {
    email: "",
    password: "",
  };
  // Hooks
  const { setAlerts } = useAlert();
  const { setAdmin, setCustomer } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialSate);

  // Destructure form data
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

      // Clear form data
      setFormData({
        email: "",
        password: "",
      });

      // Update state
      if (response.data.role === "ADMIN") {
        setAdmin(response.data);
      } else {
        setCustomer(response.data);
      }
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
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
