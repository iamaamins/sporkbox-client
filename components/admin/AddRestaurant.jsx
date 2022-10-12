import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { hasEmpty } from "@utils/index";
import { useData } from "@context/Data";
import styles from "@styles/admin/AddRestaurant.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function AddRestaurant() {
  // Initial state
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    restaurantAddress: "",
  };

  // Hooks
  const router = useRouter();
  const { setVendors } = useData();
  const [formData, setFormData] = useState(initialState);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    name,
    email,
    password,
    confirmPassword,
    restaurantName,
    restaurantAddress,
  } = formData;

  // Handle change
  function handleChange(e) {
    // Check for empty field
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
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/add`,
        formData,
        {
          withCredentials: true,
        }
      );

      // New restaurant
      const newVendor = res.data;

      // Update state
      setVendors((currVendors) => [...currVendors, newVendor]);

      // Reset form data
      setFormData(initialState);

      // Remove loader
      setIsLoading(false);
      setIsDisabled(true);

      // Push to dashboard
      router.push("/admin/restaurants");
    } catch (err) {
      console.log(err);
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
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={handleChange} />
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
          <label htmlFor="confirmPassword">Confirm password</label>
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
          <label htmlFor="restaurantAddress">Address</label>
          <input
            type="text"
            id="restaurantAddress"
            value={restaurantAddress}
            onChange={handleChange}
          />
        </div>

        <ActionButton
          text="Add restaurant"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </form>
    </section>
  );
}
