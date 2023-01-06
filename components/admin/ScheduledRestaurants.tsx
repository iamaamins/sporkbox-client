import Link from "next/link";
import { useData } from "@context/Data";
import { FormEvent, useState } from "react";
import ActionModal from "./ActionModal";
import { IScheduledRestaurant } from "types";
import { axiosInstance, convertDateToText } from "@utils/index";
import styles from "@styles/admin/ScheduledRestaurants.module.css";
import ModalContainer from "@components/layout/ModalContainer";

export default function ScheduledRestaurants() {
  // Hooks
  const {
    scheduledRestaurants,
    setScheduledRestaurants,
    setAllUpcomingOrders,
  } = useData();
  const [isUpdatingScheduleStatus, setIsUpdatingScheduleStatus] =
    useState(false);
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: "",
    restaurant: {
      _id: "",
      name: "",
    },
    scheduleId: "",
  });
  const [scheduleRemovalPayload, setScheduleRemovalPayload] = useState({
    restaurant: {
      _id: "",
      name: "",
    },
    schedule: {
      _id: "",
      date: "",
    },
    companyId: "",
  });
  const [isRemovingSchedule, setIsRemovingSchedule] = useState(false);
  const [showScheduleRemovalModal, setShowScheduleRemovalModal] =
    useState(false);
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
    setStatusUpdatePayload({
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
        `/restaurants/${statusUpdatePayload.restaurant._id}/${statusUpdatePayload.scheduleId}/change-schedule-status`,
        { action: statusUpdatePayload.action }
      );

      // Find the updated schedule
      const schedule = response.data.find(
        (schedule: IScheduledRestaurant) =>
          schedule.scheduleId === statusUpdatePayload.scheduleId
      );

      // Update state
      setScheduledRestaurants((currState) => ({
        ...currState,
        data: currState.data.map((scheduledRestaurant) => {
          if (
            scheduledRestaurant.scheduleId === statusUpdatePayload.scheduleId
          ) {
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

  // Initiate schedule removal
  function initiateScheduleRemoval(
    restaurantId: string,
    restaurantName: string,
    scheduledDate: string,
    scheduleId: string,
    companyId: string
  ) {
    // Update states
    setShowScheduleRemovalModal(true);
    setScheduleRemovalPayload({
      restaurant: {
        _id: restaurantId,
        name: restaurantName,
      },
      schedule: {
        _id: scheduleId,
        date: scheduledDate,
      },
      companyId,
    });
  }

  // Remove a schedule
  async function removeSchedule() {
    try {
      // Show loader
      setIsRemovingSchedule(true);

      // Make request to the backend
      await axiosInstance.patch(
        `/restaurants/${scheduleRemovalPayload.restaurant._id}/${scheduleRemovalPayload.schedule._id}/remove-schedule`
      );

      // Remove the schedule
      setScheduledRestaurants((currState) => ({
        ...currState,
        data: currState.data.filter(
          (scheduledRestaurant) =>
            scheduledRestaurant.scheduleId !==
            scheduleRemovalPayload.schedule._id
        ),
      }));

      // Remove upcoming orders
      setAllUpcomingOrders((currState) => ({
        ...currState,
        data: currState.data.filter(
          (upcomingOrder) =>
            !(
              upcomingOrder.company._id === scheduleRemovalPayload.companyId &&
              upcomingOrder.delivery.date ===
                scheduleRemovalPayload.schedule.date &&
              upcomingOrder.restaurant._id ===
                scheduleRemovalPayload.restaurant._id
            )
        ),
      }));
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Close modal and remove loader
      setIsRemovingSchedule(false);
      setShowScheduleRemovalModal(false);
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
                  <th className={styles.hide_on_mobile}>Actions</th>
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
                    <td
                      className={`${styles.actions} ${styles.hide_on_mobile}`}
                    >
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
                      <span
                        className={styles.remove}
                        onClick={() =>
                          initiateScheduleRemoval(
                            scheduledRestaurant._id,
                            scheduledRestaurant.name,
                            scheduledRestaurant.date,
                            scheduledRestaurant.scheduleId,
                            scheduledRestaurant.company._id
                          )
                        }
                      >
                        Remove
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Status update modal */}
      <ModalContainer
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
        component={
          <ActionModal
            name={statusUpdatePayload.restaurant.name}
            action={statusUpdatePayload.action}
            performAction={updateStatus}
            isPerformingAction={isUpdatingScheduleStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />

      {/* Schedule removal modal */}
      <ModalContainer
        showModalContainer={showScheduleRemovalModal}
        setShowModalContainer={setShowScheduleRemovalModal}
        component={
          <ActionModal
            action="Remove"
            performAction={removeSchedule}
            isPerformingAction={isRemovingSchedule}
            name={scheduleRemovalPayload.restaurant.name}
            setShowActionModal={setShowScheduleRemovalModal}
          />
        }
      />
    </section>
  );
}
