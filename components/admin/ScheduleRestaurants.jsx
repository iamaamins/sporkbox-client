import axios from "axios";
import { useData } from "@context/Data";
import { useEffect, useState } from "react";
import ActionButton from "@components/layout/ActionButton";
import styles from "@styles/admin/ScheduleRestaurants.module.css";
import { hasEmpty, updateScheduledRestaurants } from "@utils/index";

export default function ScheduleRestaurants() {
  // Initial state
  const initialState = {
    date: "",
    restaurantId: "",
  };

  // Hooks
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { vendors, setScheduledRestaurants } = useData();
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);

  // Destructure form data
  const { date, restaurantId } = formData;

  // Get the approved restaurants
  useEffect(() => {
    if (vendors.length > 0) {
      // Filter approved restaurants
      setApprovedRestaurants(
        vendors.map(
          (vendor) => vendor.status === "APPROVED" && vendor.restaurant
        )
      );
    }
  }, [vendors]);

  // Handle change
  function handleChange(e) {
    // If any field is empty
    if (hasEmpty(formData)) {
      setIsDisabled(false);
    }

    // Update state
    setFormData((currData) => ({
      ...currData,
      [e.target.name]: e.target.value,
    }));
  }

  // Handle schedule
  async function handleSchedule(e) {
    e.preventDefault();

    // Schedule a restaurant
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}/schedule`,
        { date },
        { withCredentials: true }
      );

      const updatedData = res.data;

      // Update scheduled restaurants
      updateScheduledRestaurants(res, setScheduledRestaurants);

      // Clear form data
      setFormData(initialState);

      // Remove loader
      setIsLoading(false);

      // Disable button
      setIsDisabled(true);
    } catch (err) {
      console.log(err);

      // Remove loader and disable button
      setIsLoading(false);
      setIsDisabled(true);
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

            <ActionButton
              text="Schedule"
              isLoading={isLoading}
              isDisabled={isDisabled}
            />
          </form>
        </>
      )}
    </section>
  );
}
