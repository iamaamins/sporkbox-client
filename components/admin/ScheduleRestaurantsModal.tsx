import { axiosInstance } from "@utils/index";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import SubmitButton from "../layout/SubmitButton";
import { IFormData, IModalProps, IRestaurant } from "types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/ScheduleRestaurantsModal.module.css";

export default function Modal({ showModal, setShowModal }: IModalProps) {
  // Initial state
  const initialState = {
    date: "",
    restaurantId: "",
  };

  // Hooks
  const router = useRouter();
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
    if (vendors.data.length > 0) {
      // Filter approved restaurants
      setApprovedRestaurants(
        vendors.data
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

      const data = { ...formData, companyId: router.query.company };

      // Make request to backend
      const response = await axiosInstance.put(`/restaurants/schedule/`, data);

      // Update scheduled restaurants state
      setScheduledRestaurants((currState) => ({
        ...currState,
        data: [...currState.data, response.data],
      }));

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
    <>
      <div className={`${styles.modal} ${showModal && styles.show}`}>
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
      </div>

      <div
        onClick={() => setShowModal(false)}
        className={`${styles.overlay} ${showModal && styles.show}`}
      ></div>
    </>
  );
}
