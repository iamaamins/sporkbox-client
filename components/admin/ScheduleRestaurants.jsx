import { useEffect, useState } from "react";
import {
  API_URL,
  convertDate,
  hasEmpty,
  updateRestaurants,
} from "@utils/index";
import { useData } from "@context/data";
import styles from "@styles/admin/ScheduleRestaurants.module.css";
import axios from "axios";

export default function ScheduleRestaurants() {
  // Initial state
  const initialState = {
    date: "",
    restaurantId: "",
  };

  // Hooks
  const { restaurants, setRestaurants } = useData();
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);

  // Destructure form data
  const { date, restaurantId } = formData;

  // Get the approved restaurants
  useEffect(() => {
    if (restaurants) {
      // Filter approved restaurants
      setApprovedRestaurants(
        restaurants.filter((restaurant) => restaurant.status === "APPROVED")
      );
    }
  }, [restaurants]);

  // Handle change
  function handleChange(e) {
    // If any field is empty
    if (hasEmpty(formData)) {
      setDisabled(false);
    }

    // Update state
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  // Handle schedule
  async function handleSchedule(e) {
    e.preventDefault();

    // Schedule a restaurant
    try {
      // Make request to backend
      const res = await axios.put(
        `${API_URL}/restaurant/${restaurantId}/schedule`,
        { date },
        { withCredentials: true }
      );

      // Update restaurants with updates schedules at
      updateRestaurants(res, "scheduledAt", setRestaurants);

      // Clear form data
      setFormData(initialState);

      // Disable button
      setDisabled(true);
    } catch (err) {
      console.log(err);
      setDisabled(true);
    }
  }

  return (
    <section className={styles.schedule_restaurants}>
      {approvedRestaurants.length === 0 && <h2>No approved restaurants</h2>}

      {approvedRestaurants.length > 0 && (
        <>
          <h2 className={styles.schedule_restaurants_title}>
            Schedule restaurants
          </h2>

          <form onSubmit={handleSchedule}>
            <div className={styles.item}>
              <label htmlFor="date">Select a date</label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleChange}
              />
            </div>

            <div className={styles.item}>
              <select
                name="restaurantId"
                value={restaurantId}
                onChange={handleChange}
              >
                <option hidden aria-hidden value="Please select a restaurant">
                  Please select a restaurant
                </option>

                {approvedRestaurants.map((approvedRestaurant) => (
                  <option
                    key={approvedRestaurant._id}
                    value={approvedRestaurant._id}
                  >
                    {approvedRestaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`${styles.button} ${!disabled && styles.active}`}
            >
              Schedule
            </button>
          </form>
        </>
      )}
    </section>
  );
}

{
  /* {addedRestaurants.length > 0 && (
        <section className={styles.restaurants}>
          <p className={styles.restaurants_title}>Selected restaurants</p>

          {addedRestaurants.map((addedRestaurant, index) => (
            <div key={index} className={styles.restaurant}>
              <p>{addedRestaurant.restaurant}</p>
              <p>{addedRestaurant.date}</p>
            </div>
          ))}

          <button className={`${styles.button} ${styles.submit}`}>
            Submit
          </button>
        </section>
      )} */
}
