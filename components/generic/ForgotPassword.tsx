import Link from "next/link";
import { axiosInstance } from "@utils/index";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";
import styles from "@styles/generic/ForgotPassword.module.css";

export default function ForgotPassword() {
  // Hooks
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show the loader
      setIsLoading(true);

      // Make request to the backend
      const response = await axiosInstance.post(`/users/forgot-password`, {
        email,
      });

      // Clear form data
      setEmail("");

      // Show alert and push to the homepage
      console.log(response.data);
      router.push("/");
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.forgot_password}>
      <p className={styles.title}>Forgot password?</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <SubmitButton text="Submit" isLoading={isLoading} />
      </form>

      <div className={styles.actions}>
        <p>
          Don&apos;t have an account? Register{" "}
          <Link href="/register">
            <a>here</a>
          </Link>
        </p>

        <p>
          Have the password? Sign in{" "}
          <Link href="/login">
            <a>here</a>
          </Link>
        </p>
      </div>
    </section>
  );
}
