import { useState } from "react";
import { hasEmpty } from "@utils/index";
import styles from "@styles/admin/AddItem.module.css";

export default function AddItem() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    price: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Destructure form data and check
  const { name, description, tags, price } = formData;

  // Handle change
  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setDisabled(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);

    setFormData({
      name: "",
      description: "",
      password: "",
      confirmPassword: "",
    });
  }
  return (
    <section className={styles.add_item}>
      <p className={styles.title}>Add an item</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="name">Item name</label>
          <input type="name" id="name" value={name} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="tags">Item tags</label>
          <input type="tags" id="tags" value={tags} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="price">Item price</label>
          <input
            type="price"
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

        <button
          type="submit"
          className={`${styles.button} ${!disabled && styles.active}`}
        >
          Add Item
        </button>
      </form>
    </section>
  );
}
