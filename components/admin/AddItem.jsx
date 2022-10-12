import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { useData } from "@context/data";
import styles from "@styles/admin/AddItem.module.css";
import { hasEmpty, updateVendors } from "@utils/index";
import ActionButton from "@components/layout/ActionButton";

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
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Destructure form data and check
  const { name, description, tags, price } = formData;

  // Handle change
  function handleChange(e) {
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
  async function handleSubmit(e) {
    e.preventDefault();

    // Add a new item
    try {
      // Show loader
      setIsLoading(true);

      // Post the data to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${router.query.restaurant}/add-item`,
        formData,
        {
          withCredentials: true,
        }
      );

      // Update vendors with updated items
      updateVendors(res, setVendors);

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
          <label htmlFor="tags">Item tags</label>
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
            type="description"
            id="description"
            value={description}
            onChange={handleChange}
          />
        </div>

        <ActionButton
          text="Add Item"
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </form>
    </section>
  );
}
