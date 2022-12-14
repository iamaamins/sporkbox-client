import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { IFormData, IVendor } from "types";
import { axiosInstance } from "@utils/index";
import { ChangeEvent, FormEvent, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";
import styles from "@styles/admin/AddRestaurant.module.css";

export default function AddRestaurant() {
  // Initial state
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    state: "",
    zip: "",
    confirmPassword: "",
    restaurantName: "",
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const {
    firstName,
    lastName,
    email,
    password,
    city,
    state,
    zip,
    confirmPassword,
    restaurantName,
    addressLine1,
    addressLine2,
  } = formData;

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
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const response = await axiosInstance.post(`/vendors/add`, formData);

      // Update state
      setVendors((currState) => ({
        ...currState,
        data: [...currState.data, response.data],
      }));

      // Reset form data
      setFormData(initialState);

      // Push to dashboard
      router.push("/admin/restaurants");
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_restaurant}>
      <h2>Add a restaurant</h2>

      <form onSubmit={handleSubmit}>
        <p className={styles.form_title}>Owner info</p>

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
          <label htmlFor="email">Email address</label>
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

        <p className={styles.form_title}>Restaurant info</p>

        <div className={styles.item}>
          <label htmlFor="restaurantName">Name</label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="addressLine1">Address line 1</label>
          <input
            type="text"
            id="addressLine1"
            value={addressLine1}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="addressLine2">Address line 2</label>
          <input
            type="text"
            id="addressLine2"
            value={addressLine2}
            onChange={handleChange}
          />
        </div>

        <div className={styles.city_state_zip}>
          <div className={styles.item}>
            <label htmlFor="city">City</label>
            <input type="text" id="city" value={city} onChange={handleChange} />
          </div>

          <div className={styles.item}>
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={handleChange}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor="zip">Zip</label>
            <input type="text" id="zip" value={zip} onChange={handleChange} />
          </div>
        </div>

        <SubmitButton text="Add restaurant" isLoading={isLoading} />
      </form>
    </section>
  );
}
