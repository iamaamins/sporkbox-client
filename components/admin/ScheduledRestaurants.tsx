import Link from "next/link";
import { useData } from "@context/Data";
import { axiosInstance, convertDateToText } from "@utils/index";
import Modal from "@components/layout/Modal";
import styles from "@styles/admin/ScheduledRestaurants.module.css";
import { FormEvent, useState } from "react";
import StatusUpdate from "./StatusUpdate";
import { IScheduledRestaurant } from "types";

export default function ScheduledRestaurants() {
  // Hooks
  const { scheduledRestaurants, setScheduledRestaurants } = useData();
  const [isUpdatingScheduleStatus, setIsUpdatingScheduleStatus] =
    useState(false);
  const [payload, setPayload] = useState({
    action: "",
    restaurant: {
      _id: "",
      name: "",
    },
    scheduleId: "",
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

  // Initiate schedule update
  function initiateScheduleUpdate(
    e: FormEvent,
    restaurantId: string,
    restaurantName: string,
    scheduleId: string
  ) {
    // update states
    setShowStatusUpdateModal(true);
    setPayload({
      action: e.currentTarget.textContent!,
      scheduleId,
      restaurant: {
        _id: restaurantId,
        name: restaurantName,
      },
    });
  }

  // Update schedule status
  async function updateStatus() {
    try {
      // Show loader
      setIsUpdatingScheduleStatus(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/restaurants/${payload.restaurant._id}/${payload.scheduleId}/change-schedule-status`,
        { action: payload.action }
      );

      // Find the updated schedule
      const schedule = response.data.find(
        (schedule: IScheduledRestaurant) =>
          schedule.scheduleId === payload.scheduleId
      );

      // Update state
      setScheduledRestaurants((currState) => ({
        ...currState,
        data: currState.data.map((scheduledRestaurant) => {
          if (scheduledRestaurant.scheduleId === payload.scheduleId) {
            return {
              ...scheduledRestaurant,
              status: schedule.status,
            };
          } else {
            return scheduledRestaurant;
          }
        }),
      }));
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove loader and close modal
      setIsUpdatingScheduleStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  return (
    <section className={styles.scheduled_restaurants}>
      {scheduledRestaurants.isLoading && <h2>Loading...</h2>}

      {!scheduledRestaurants.isLoading &&
        scheduledRestaurants.data.length === 0 && (
          <h2>No scheduled restaurants</h2>
        )}

      {scheduledRestaurants.data.length > 0 && (
        <>
          <h2>Scheduled restaurants</h2>

          <div className={styles.restaurants}>
            <table>
              <thead>
                <tr>
                  <th>Scheduled on</th>
                  <th>Restaurant</th>
                  <th>Company</th>
                  {/* <th>Actions</th> Remove this */}
                </tr>
              </thead>

              <tbody>
                {scheduledRestaurants.data.map((scheduledRestaurant, index) => (
                  <tr key={index}>
                    <td className={styles.important}>
                      <Link
                        href={`/admin/restaurants/${scheduledRestaurant._id}`}
                      >
                        <a>{convertDateToText(scheduledRestaurant.date)}</a>
                      </Link>
                    </td>
                    <td>{scheduledRestaurant.name}</td>
                    <td>{scheduledRestaurant.company.name}</td>
                    {/* <td className={styles.actions}>
                      <span
                        className={styles.deactivate}
                        onClick={(e) =>
                          initiateScheduleUpdate(
                            e,
                            scheduledRestaurant._id,
                            scheduledRestaurant.name,
                            scheduledRestaurant.scheduleId
                          )
                        }
                      >
                        {scheduledRestaurant.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </span>
                      <span className={styles.remove}>Remove</span>
                    </td> Remove this */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        showModal={showStatusUpdateModal}
        setShowModal={setShowStatusUpdateModal}
        component={
          <StatusUpdate
            name={payload.restaurant.name}
            action={payload.action}
            updateStatus={updateStatus}
            isUpdatingStatus={isUpdatingScheduleStatus}
            setShowStatusUpdateModal={setShowStatusUpdateModal}
          />
        }
      />
    </section>
  );
}
