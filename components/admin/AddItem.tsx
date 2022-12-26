import ItemForm from "./ItemForm";
import { IFormData } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { FormEvent, useState } from "react";
import styles from "@styles/admin/AddItem.module.css";
import { axiosInstance, updateVendors } from "@utils/index";

export default function AddItem() {
  // Initial state
  const initialState = {
    name: "",
    tags: "",
    price: 0,
    description: "",
  };

  // Hooks
  const router = useRouter();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Add a new item
    try {
      // Show loader
      setIsLoading(true);

      // Post the data to backend
      const response = await axiosInstance.post(
        `/restaurants/${router.query.restaurant}/add-item`,
        formData
      );

      // Update vendors with updated items
      updateVendors(response.data, setVendors);

      // Reset form data
      setFormData(initialState);

      // Back to the restaurant page
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_item}>
      <h2>Add an item</h2>

      <ItemForm
        formData={formData}
        setFormData={setFormData}
        buttonText="Save"
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
