import { IFormData } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { axiosInstance } from "@utils/index";
import { FormEvent, useState } from "react";
import RestaurantForm from "./RestaurantForm";
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
  const [file, setFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const {
    firstName,
    lastName,
    email,
    city,
    state,
    zip,
    password,
    addressLine1,
    addressLine2,
    restaurantName,
  } = formData;

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Append the data
    data.append("file", file as File);
    data.append("firstName", firstName as string);
    data.append("lastName", lastName as string);
    data.append("email", email as string);
    data.append("city", city as string);
    data.append("state", state as string);
    data.append("zip", zip as string);
    data.append("password", password as string);
    data.append("restaurantName", restaurantName as string);
    data.append("addressLine1", addressLine1 as string);
    data.append("addressLine2", addressLine2 as string);

    try {
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const response = await axiosInstance.post(`/vendors/add-vendor`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

      <RestaurantForm
        file={file}
        setFile={setFile}
        isLoading={isLoading}
        formData={formData}
        showPasswordFields={true}
        setFormData={setFormData}
        buttonText="Add restaurant"
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
