import { useData } from "@context/Data";
import { axiosInstance } from "@utils/index";
import SubmitButton from "@components/layout/SubmitButton";
import styles from "@styles/admin/ScheduleRestaurants.module.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IFormData, IRestaurant, IScheduledRestaurant } from "types";

export default function ScheduleRestaurants() {
  // Initial state
  const initialState = {
    date: "",
    restaurantId: "",
  };

  // Hooks
  const { vendors, setScheduledRestaurants } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [approvedRestaurants, setApprovedRestaurants] = useState<IRestaurant[]>(
    []
  );
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const { date, restaurantId } = formData;

  // Get the approved restaurants
  useEffect(() => {
    if (vendors.length > 0) {
      // Filter approved restaurants
      setApprovedRestaurants(
        vendors
          .filter((vendor) => vendor.status === "APPROVED")
          .map((vendor) => vendor.restaurant)
      );
    }
  }, [vendors]);

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    // Update state
    setFormData((currData) => ({
      ...currData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle schedule
  async function handleSchedule(e: FormEvent) {
    e.preventDefault();

    // Schedule a restaurant
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.put(
        `/restaurants/schedule/${restaurantId}`,
        { date }
      );

      // Update scheduled restaurants state
      setScheduledRestaurants(
        (currScheduledRestaurants: IScheduledRestaurant[]) => [
          ...currScheduledRestaurants,
          response.data,
        ]
      );

      // Clear form data
      setFormData(initialState);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  // Create min date for date picker
  const today = new Date();

  // Format date like 2022-11-08
  const minDate = today.toISOString().split("T")[0];

  return (
    <section className={styles.schedule_restaurants}>
      {approvedRestaurants?.length === 0 && <h2>No approved restaurants</h2>}

      {approvedRestaurants?.length > 0 && (
        <>
          <h2 className={styles.schedule_restaurants_title}>
            Schedule restaurants
          </h2>

          <form onSubmit={handleSchedule}>
            <div className={styles.item}>
              <label htmlFor="date">Select a date</label>
              <input
                type="date"
                id="date"
                value={date}
                min={minDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.item}>
              <select
                id="restaurantId"
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

            <SubmitButton text="Schedule" isLoading={isLoading} />
          </form>
        </>
      )}
    </section>
  );
}
