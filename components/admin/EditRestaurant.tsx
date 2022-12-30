import { useData } from "@context/Data";
import { axiosInstance, updateVendors } from "@utils/index";
import { IFormData, IVendor } from "types";
import { useRouter } from "next/router";
import SubmitButton from "@components/layout/SubmitButton";
import styles from "@styles/admin/EditRestaurant.module.css";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function EditRestaurant() {
  // Initial state
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    zip: "",
    restaurantName: "",
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<IVendor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Get the restaurant
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the vendor
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );

      // Update vendor
      setVendor(vendor);

      // Update form data
      setFormData((currState) => {
        if (vendor) {
          return {
            ...currState,
            firstName: vendor.firstName,
            lastName: vendor.lastName,
            email: vendor.email,
            restaurantName: vendor.restaurant.name,
            addressLine1: vendor.restaurant.address.split(",")[0],
            addressLine2: vendor.restaurant.address.split(",")[1].trim(),
            city: vendor.restaurant.address.split(",")[2].trim(),
            state: vendor.restaurant.address.split(",")[3].trim().split(" ")[0],
            zip: vendor.restaurant.address.split(",")[3].trim().split(" ")[1],
          };
        } else {
          return currState;
        }
      });
    }
  }, [vendors, router.isReady]);

  // Destructure form data
  const {
    firstName,
    lastName,
    email,
    city,
    state,
    zip,
    restaurantName,
    addressLine1,
    addressLine2,
  } = formData;

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
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const response = await axiosInstance.patch(
        `/vendors/${vendor?._id}/update/details`,
        formData
      );

      // Update vendors
      updateVendors(response.data, setVendors);

      // Push to dashboard
      router.push(`/admin/restaurants/${response.data.restaurant._id}`);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.edit_restaurant}>
      {vendors.isLoading && <h2>Loading...</h2>}

      {!vendors.isLoading && !vendor && <h2>No vendor found</h2>}

      {vendor && (
        <>
          <h2>Edit the details</h2>

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
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={handleChange}
                />
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
                <input
                  type="text"
                  id="zip"
                  value={zip}
                  onChange={handleChange}
                />
              </div>
            </div>

            <SubmitButton text="Save" isLoading={isLoading} />
          </form>
        </>
      )}
    </section>
  );
}
