import Link from 'next/link';
import ActionModal from '../layout/ActionModal';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import { FormEvent, useState } from 'react';
import {
  axiosInstance,
  dateToText,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { CustomAxiosError, Guest, UserStatus } from 'types';
import styles from './Guests.module.css';
import ModalContainer from '@components/layout/ModalContainer';

type Props = { status: UserStatus; guests: Guest[] };

export default function Guests({ status, guests }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setGuests } = useData();
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: '',
    data: {
      guestId: '',
      guestName: '',
    },
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isUpdatingGuestStatus, setIsUpdatingGuestStatus] = useState(false);

  function initiateStatusUpdate(e: FormEvent, guestId: string) {
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      action: e.currentTarget.textContent!,
      data: {
        guestId,
        guestName: guests.find((guest) => guest._id === guestId)
          ?.firstName as string,
      },
    });
  }

  async function updateGuestStatus() {
    try {
      setIsUpdatingGuestStatus(true);

      const response = await axiosInstance.patch(
        `/guests/${statusUpdatePayload.data.guestId}/change-guest-status`,
        { action: statusUpdatePayload.action }
      );

      setGuests((prevState) => ({
        ...prevState,
        data: prevState.data.map((guest) => {
          if (guest._id !== response.data._id) return guest;
          return { ...guest, status: response.data.status };
        }),
      }));

      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingGuestStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  return (
    <>
      <table className={styles.container}>
        <thead>
          <tr>
            <th>Name</th>
            <th className={styles.hide_on_mobile}>Email</th>
            <th className={styles.hide_on_mobile}>Added</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {guests.map((guest) => (
            <tr key={guest._id}>
              <td className={styles.important}>
                <Link
                  href={`/admin/companies/${router.query.company}/${guest._id}`}
                >
                  <a>
                    {guest.firstName} {guest.lastName}
                  </a>
                </Link>
              </td>
              <td className={styles.hide_on_mobile}>{guest.email}</td>
              <td className={styles.hide_on_mobile}>
                {dateToText(guest.createdAt)}
              </td>
              <td>
                <Link
                  href={`/admin/companies/${router.query.company}/${guest._id}/edit-guest`}
                >
                  <a className={`${styles.button} ${styles.edit_details}`}>
                    Edit
                  </a>
                </Link>
                {status && (
                  <span
                    className={`${styles.button} ${styles.change_status}`}
                    onClick={(e) => initiateStatusUpdate(e, guest._id)}
                  >
                    {status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalContainer
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
        component={
          <ActionModal
            name={statusUpdatePayload.data.guestName}
            action={statusUpdatePayload.action}
            performAction={updateGuestStatus}
            isPerformingAction={isUpdatingGuestStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />
    </>
  );
}
