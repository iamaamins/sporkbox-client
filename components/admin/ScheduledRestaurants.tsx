import Link from 'next/link';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import ActionModal from './ActionModal';
import { FormEvent, useState } from 'react';
import {
  CustomAxiosError,
  IScheduledRestaurant,
  IScheduledRestaurantProps,
} from 'types';
import {
  axiosInstance,
  convertDateToText,
  showErrorAlert,
  showSuccessAlert,
} from '@utils/index';
import ModalContainer from '@components/layout/ModalContainer';
import styles from '@styles/admin/ScheduledRestaurants.module.css';

export default function ScheduledRestaurants({
  isLoading,
  restaurants,
}: IScheduledRestaurantProps) {
  // Hooks
  const { setAlerts } = useAlert();
  const { setAllUpcomingOrders, setScheduledRestaurants } = useData();
  const [isUpdatingScheduleStatus, setIsUpdatingScheduleStatus] =
    useState(false);
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: '',
    restaurant: {
      _id: '',
      name: '',
    },
    scheduleId: '',
  });
  const [scheduleRemovalPayload, setScheduleRemovalPayload] = useState({
    restaurant: {
      _id: '',
      name: '',
    },
    schedule: {
      _id: '',
      date: '',
    },
    companyId: '',
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
      setScheduledRestaurants((prevState) => ({
        ...prevState,
        data: prevState.data.map((scheduledRestaurant) => {
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

      // Show success alert
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
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
      setScheduledRestaurants((prevState) => ({
        ...prevState,
        data: prevState.data.filter(
          (scheduledRestaurant) =>
            scheduledRestaurant.scheduleId !==
            scheduleRemovalPayload.schedule._id
        ),
      }));

      // Remove upcoming orders
      setAllUpcomingOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter(
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

      // Show success alert
      showSuccessAlert('Schedule removed', setAlerts);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Close modal and remove loader
      setIsRemovingSchedule(false);
      setShowScheduleRemovalModal(false);
    }
  }

  return (
    <section className={styles.scheduled_restaurants}>
      {isLoading && <h2>Loading...</h2>}

      {!isLoading && restaurants.length === 0 && (
        <h2>No scheduled restaurants</h2>
      )}

      {restaurants.length > 0 && (
        <>
          <h2>Scheduled restaurants</h2>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Restaurant</th>
                <th>Company</th>
                <th>Shift</th>
                <th className={styles.hide_on_mobile}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {restaurants.map((scheduledRestaurant, index) => (
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
                  <td className={styles.shift}>
                    {scheduledRestaurant.company.shift}
                  </td>
                  <td className={`${styles.actions} ${styles.hide_on_mobile}`}>
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
                      {scheduledRestaurant.status === 'ACTIVE'
                        ? 'Deactivate'
                        : 'Activate'}
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
            action='Remove'
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
