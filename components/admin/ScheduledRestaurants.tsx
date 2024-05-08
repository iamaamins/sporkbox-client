import Link from 'next/link';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import ActionModal from './ActionModal';
import { FormEvent, useState } from 'react';
import { CustomAxiosError, ScheduledRestaurant } from 'types';
import {
  axiosInstance,
  dateToText,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import ModalContainer from '@components/layout/ModalContainer';
import styles from './ScheduledRestaurants.module.css';

type Props = { isLoading: boolean; restaurants: ScheduledRestaurant[] };

export default function ScheduledRestaurants({
  isLoading,
  restaurants,
}: Props) {
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

  function initiateScheduleUpdate(
    e: FormEvent,
    restaurantId: string,
    restaurantName: string,
    scheduleId: string
  ) {
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

  async function updateStatus() {
    try {
      setIsUpdatingScheduleStatus(true);
      const response = await axiosInstance.patch(
        `/restaurants/${statusUpdatePayload.restaurant._id}/${statusUpdatePayload.scheduleId}/change-schedule-status`,
        { action: statusUpdatePayload.action }
      );
      const schedule = response.data.find(
        (schedule: ScheduledRestaurant) =>
          schedule.schedule._id === statusUpdatePayload.scheduleId
      );
      setScheduledRestaurants((prevState) => ({
        ...prevState,
        data: prevState.data.map((restaurant) => {
          if (restaurant.schedule._id === statusUpdatePayload.scheduleId) {
            return {
              ...restaurant,
              status: schedule.status,
            };
          } else {
            return restaurant;
          }
        }),
      }));
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingScheduleStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  function initiateScheduleRemoval(
    restaurantId: string,
    restaurantName: string,
    scheduledDate: string,
    scheduleId: string,
    companyId: string
  ) {
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

  async function removeSchedule() {
    try {
      setIsRemovingSchedule(true);
      await axiosInstance.patch(
        `/restaurants/${scheduleRemovalPayload.restaurant._id}/${scheduleRemovalPayload.schedule._id}/remove-schedule`
      );
      setScheduledRestaurants((prevState) => ({
        ...prevState,
        data: prevState.data.filter(
          (restaurant) =>
            restaurant.schedule._id !== scheduleRemovalPayload.schedule._id
        ),
      }));
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
      showSuccessAlert('Schedule removed', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
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
              {restaurants.map((restaurant, index) => (
                <tr key={index}>
                  <td className={styles.important}>
                    <Link href={`/admin/restaurants/${restaurant._id}`}>
                      <a>{dateToText(restaurant.schedule.date)}</a>
                    </Link>
                  </td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.company.name}</td>
                  <td className={styles.shift}>{restaurant.company.shift}</td>
                  <td className={`${styles.actions} ${styles.hide_on_mobile}`}>
                    <span
                      className={styles.deactivate}
                      onClick={(e) =>
                        initiateScheduleUpdate(
                          e,
                          restaurant._id,
                          restaurant.name,
                          restaurant.schedule._id
                        )
                      }
                    >
                      {restaurant.schedule.status === 'ACTIVE'
                        ? 'Deactivate'
                        : 'Activate'}
                    </span>
                    <span
                      className={styles.remove}
                      onClick={() =>
                        initiateScheduleRemoval(
                          restaurant._id,
                          restaurant.name,
                          restaurant.schedule._id,
                          restaurant.company._id,
                          restaurant.schedule.date
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
