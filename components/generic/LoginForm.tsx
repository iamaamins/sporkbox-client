import Link from "next/link";
import axios from "axios";
import { IFormData } from "types";
import { hasEmpty } from "@utils/index";
import { useUser } from "@context/User";
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
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialSate);

  // Destructure form data and check
  // If there is an empty field
  const { email, password } = formData;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!hasEmpty(formData)) {
      setIsDisabled(false);
    }

    // Update state
    setFormData((currData) => ({
      ...currData,
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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
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

        <SubmitButton
          text="Sign in"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
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
          <Link href="/reset-password">
            <a>here</a>
          </Link>
        </p>
      </div>
    </section>
  );
}
