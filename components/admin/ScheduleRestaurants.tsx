import { useData } from "@context/Data";
import { axiosInstance, hasEmpty } from "@utils/index";
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
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
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

      // Remove loader
      setIsLoading(false);

      // Disable button
      setIsDisabled(true);
    } catch (err) {
      console.log(err);

      // Remove loader and disable button
      setIsLoading(false);
    }
  }

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

            <SubmitButton
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
