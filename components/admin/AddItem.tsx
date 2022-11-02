import axios from "axios";
import { IFormData } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import styles from "@styles/admin/AddItem.module.css";
import { axiosInstance, hasEmpty, updateVendors } from "@utils/index";
import { ChangeEvent, FormEvent, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";

export default function AddItem() {
  // Initial state
  const initialState = {
    name: "",
    tags: "",
    price: 0,
    description: "",
  };

  // Hooks
  // Router
  const router = useRouter();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data and check
  const { name, description, tags, price } = formData;

  // Handle change
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!hasEmpty(formData)) {
      setIsDisabled(false);
    }

    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currData) => ({
      ...currData,
      [id]: id === "price" ? +value : value,
    }));
  }

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

      // Remove loader
      setIsLoading(false);

      // Back to the restaurant page
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_item}>
      <p className={styles.title}>Add an item</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="name">Item name</label>
          <input type="text" id="name" value={name} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="tags">Item tags (comma separated)</label>
          <input type="text" id="tags" value={tags} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="price">Item price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="description">Item description</label>
          <textarea
            id="description"
            value={description}
            onChange={handleChange}
          />
        </div>

        <SubmitButton
          text="Add Item"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </form>
    </section>
  );
}
