import React, { ChangeEvent } from "react";
import { IEditFormProps } from "types";
import styles from "@styles/admin/ItemForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";

export default function ItemForm({
  handleSubmit,
  buttonText,
  isLoading,
  formData,
  setFormData,
}: IEditFormProps) {
  // Destructure form data and check
  const { name, description, tags, price } = formData;

  // Handle change
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currData) => ({
      ...currData,
      [id]: id === "price" ? +value : value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.item}>
        <label htmlFor="name">Item name</label>
        <input type="text" id="name" value={name} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="tags">Dietary tags (comma separated)</label>
        <input type="text" id="tags" value={tags} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="price">Item price</label>
        <input type="number" id="price" value={price} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="description">Item description</label>
        <textarea
          id="description"
          value={description}
          onChange={handleChange}
        />
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
