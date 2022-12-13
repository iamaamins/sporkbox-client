import Link from "next/link";
import { IFormData } from "types";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import { axiosInstance } from "@utils/index";
import { ChangeEvent, FormEvent, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";
import styles from "@styles/generic/RegistrationForm.module.css";

export default function RegistrationForm() {
  // Initial state
  const initialSate = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // Hooks
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialSate);

  // Destructure form data and check
  // If there is an empty field
  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Check if passwords match
  const passwordsMatch = password === confirmPassword;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
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

      // Make the request to backend
      const response = await axiosInstance.post(
        `/customers/register`,
        formData
      );

      // Update state
      setUser(response.data);

      // Clear form
      setFormData(initialSate);

      // Push to dashboard page
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.registration_form}>
      <p className={styles.title}>Create your account</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleChange}
          />
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
          <label htmlFor="confirmPassword">
            Confirm password {!passwordsMatch && " - Passwords don't match"}
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>

        <SubmitButton text="Create account" isLoading={isLoading} />
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
