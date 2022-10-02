import { useState } from "react";
import { API_URL, hasEmpty } from "@utils/index";
import styles from "@styles/admin/AddItem.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useData } from "@context/data";
import Loader from "@components/layout/Loader";

export default function AddItem() {
  // Initial state
  const initialState = {
    name: "",
    description: "",
    tags: "",
    price: "",
  };

  // Hooks
  // Router
  const router = useRouter();
  const { setRestaurants } = useData();
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Destructure form data and check
  const { name, description, tags, price } = formData;

  // Handle change
  function handleChange(e) {
    if (!hasEmpty(formData)) {
      setDisabled(false);
    }

    // Update state
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
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
        `${API_URL}/restaurant/add-item`,
        {
          ...formData,
          restaurantId: router.query.restaurant,
        },
        {
          withCredentials: true,
        }
      );

      // Updated restaurant
      const updatedRestaurant = res.data;

      // Update the restaurants state
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((prevRestaurant) => {
          if (prevRestaurant._id === updatedRestaurant._id) {
            return {
              ...prevRestaurant,
              items: updatedRestaurant.items,
            };
          } else {
            return prevRestaurant;
          }
        })
      );

      // Reset form data
      setFormData(initialState);

      // Remove loader
      setIsLoading(false);

      // Back to the restaurant page
      router.back();
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
          <input type="text" id="price" value={price} onChange={handleChange} />
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
          {isLoading ? <Loader /> : "Add Item"}
        </button>
      </form>
    </section>
  );
}
