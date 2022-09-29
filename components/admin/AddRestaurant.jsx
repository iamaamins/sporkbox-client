import { useState } from "react";
import { hasEmpty } from "@utils/index";
import styles from "@styles/admin/AddRestaurant.module.css";

export default function AddRestaurant() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    restaurantAddress: "",
  });
  const [disabled, setDisabled] = useState(true);

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    restaurantName,
    restaurantAddress,
  } = formData;

  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setDisabled(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <section className={styles.add_restaurant}>
      <p className={styles.title}>Add a restaurant</p>

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

        <button
          type="submit"
          className={`${styles.button} ${!disabled && styles.active}`}
        >
          Add Restaurant
        </button>
      </form>
    </section>
  );
}
