import { useState } from "react";
import { DayPicker } from "react-day-picker";
import styles from "@styles/admin/SelectRestaurants.module.css";
import { hasEmpty } from "@utils/index";

export default function SelectRestaurants() {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    restaurant: "",
  });
  const [restaurants, setRestaurants] = useState([]);

  const { date, restaurant } = formData;

  function handleChange(e) {
    if (hasEmpty(formData)) {
      setDisabled(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setRestaurants((prevRestaurants) => [...prevRestaurants, formData]);

    setFormData({ date: "", restaurant: "" });
  }

  console.log(restaurants);
  return (
    <>
      <section className={styles.select_restaurants}>
        <p className={styles.title}>Select restaurants</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.item}>
            <label htmlFor="date">Select a date</label>
            <input type="date" id="date" value={date} onChange={handleChange} />
          </div>

          <div className={styles.item}>
            <select id="restaurant" value={restaurant} onChange={handleChange}>
              <option hidden value="Please select a restaurant">
                Please select a restaurant
              </option>
              <option value="Restaurant 1">Restaurant 1</option>
              <option value="Restaurant 2">Restaurant 2</option>
              <option value="Restaurant 3">Restaurant 3</option>
              <option value="Restaurant 4">Restaurant 4</option>
              <option value="Restaurant 5">Restaurant 5</option>
            </select>
          </div>

          <button
            type="submit"
            className={`${styles.button} ${!disabled && styles.active}`}
          >
            Add restaurant
          </button>
        </form>
      </section>

      {restaurants.length > 0 && (
        <section className={styles.restaurants}>
          {restaurants.map((restaurant, index) => (
            <div key={index} className={styles.restaurant}>
              <p>{restaurant.restaurant}</p>
              <p>{restaurant.date}</p>
            </div>
          ))}

          <button className={`${styles.button} ${styles.submit}`}>
            Submit
          </button>
        </section>
      )}
    </>
  );
}
