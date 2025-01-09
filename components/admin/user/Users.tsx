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
import { CustomAxiosError, Customer, Guest, UserRole, UserStatus } from 'types';
import styles from './Users.module.css';
import ModalContainer from '@components/layout/ModalContainer';

type Props = {
  users: Customer[] | Guest[];
  role: UserRole;
  status?: UserStatus;
};

export default function Users({ users, role, status }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setCustomers, setGuests } = useData();
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: '',
    data: {
      userId: '',
      userFirstName: '',
    },
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isUpdatingUserStatus, setIsUpdatingUserStatus] = useState(false);

  function initiateStatusUpdate(e: FormEvent, userId: string) {
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      action: e.currentTarget.textContent as string,
      data: {
        userId,
        userFirstName: users.find((user) => user._id === userId)
          ?.firstName as string,
      },
    });
  }

  async function updateUserStatus() {
    try {
      setIsUpdatingUserStatus(true);

      const response = await axiosInstance.patch(
        `/users/${statusUpdatePayload.data.userId}/change-user-status`,
        { action: statusUpdatePayload.action }
      );

      if (response.data.role === 'CUSTOMER') {
        setCustomers((prevState) => ({
          ...prevState,
          data: prevState.data.map((customer) => {
            if (customer._id !== response.data._id) return customer;
            return { ...customer, status: response.data.status };
          }),
        }));
      }

      if (response.data.role === 'GUEST') {
        setGuests((prevState) => ({
          ...prevState,
          data: prevState.data.map((guest) => {
            if (guest._id !== response.data._id) return guest;
            return { ...guest, status: response.data.status };
          }),
        }));
      }

      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingUserStatus(false);
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
            <th className={styles.hide_on_mobile}>
              {role === 'CUSTOMER' ? 'Registered' : 'Added'}
            </th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className={styles.important}>
                <Link
                  href={`/admin/companies/${router.query.company}/${user._id}`}
                >
                  <a>
                    {user.firstName} {user.lastName}
                  </a>
                </Link>
              </td>
              <td className={styles.hide_on_mobile}>{user.email}</td>
              <td className={styles.hide_on_mobile}>
                {dateToText(user.createdAt)}
              </td>
              <td>
                <Link
                  href={`/admin/companies/${router.query.company}/${user._id}/edit-user`}
                >
                  <a className={`${styles.button} ${styles.edit_details}`}>
                    Edit
                  </a>
                </Link>
                {status && (
                  <span
                    className={`${styles.button} ${styles.change_status}`}
                    onClick={(e) => initiateStatusUpdate(e, user._id)}
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
            name={statusUpdatePayload.data.userFirstName}
            action={statusUpdatePayload.action}
            performAction={updateUserStatus}
            isPerformingAction={isUpdatingUserStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />
    </>
  );
}
