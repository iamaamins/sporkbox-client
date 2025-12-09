import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './Admins.module.css';
import { Admin, CustomAxiosError } from 'types';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import { useAlert } from '@context/Alert';
import { useUser } from '@context/User';
import LinkButton from '@components/layout/LinkButton';
import ModalContainer from '@components/layout/ModalContainer';

type Admins = { isLoading: boolean; data: Admin[] | null };
type ActionPayload = { user: { id: string; name: string }; action: string };

export default function Admins() {
  const { setAlerts } = useAlert();
  const { isAdmin } = useUser();
  const [admins, setAdmins] = useState<Admins>({ isLoading: true, data: null });
  const [actionPayload, setActionPayload] = useState<ActionPayload>({
    user: { id: '', name: '' },
    action: '',
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

  function initiateAction(admin: Admin) {
    setActionPayload({
      user: { id: admin._id, name: `${admin.firstName} ${admin.lastName}` },
      action: getAction(admin),
    });
    setShowStatusUpdateModal(true);
  }

  const getAction = (admin: Admin) =>
    admin.status === 'ACTIVE' ? 'Archive' : 'Activate';

  useEffect(() => {
    async function getAdmins() {
      try {
        const response = await axiosInstance.get('/admins');
        setAdmins({ isLoading: false, data: response.data });
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setAdmins((prevState) => ({ ...prevState, isLoading: false }));
      }
    }
    if (isAdmin) getAdmins();
  }, [isAdmin]);

  return (
    <>
      <section className={styles.container}>
        <h2>
          {admins.isLoading
            ? 'Loading...'
            : !admins.isLoading && admins.data?.length === 0
            ? 'No admins found'
            : 'Admins'}
        </h2>
        {admins.data && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className={styles.hide_on_mobile}>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.data.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    {admin.firstName} {admin.lastName}
                  </td>
                  <td className={styles.hide_on_mobile}>{admin.email}</td>
                  <td>{admin.status}</td>
                  <td>{admin.role}</td>
                  <td>
                    <button
                      className={styles.action}
                      onClick={() => initiateAction(admin)}
                    >
                      {getAction(admin)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <LinkButton href='/admin/team/add' linkText='Add admin' />
      </section>
      <ModalContainer
        component={
          <StatusUpdateModal
            actionPayload={actionPayload}
            setAdmins={setAdmins}
            setShowModalContainer={setShowStatusUpdateModal}
          />
        }
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
      />
    </>
  );
}

function StatusUpdateModal({
  actionPayload,
  setAdmins,
  setShowModalContainer,
}: {
  actionPayload: ActionPayload;
  setAdmins: Dispatch<SetStateAction<Admins>>;
  setShowModalContainer: Dispatch<SetStateAction<boolean>>;
}) {
  const { setAlerts } = useAlert();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function updateStatus() {
    setIsUpdatingStatus(true);
    try {
      const response = await axiosInstance.patch(
        `/admins/${actionPayload.user.id}/update-status`,
        { action: actionPayload.action }
      );

      setAdmins((prevState) => {
        if (!prevState.data) return prevState;

        const updatedAdmins = prevState.data.map((admin) => {
          if (admin._id === actionPayload.user.id)
            return { ...admin, status: response.data.status };

          return admin;
        });

        return { ...prevState, data: updatedAdmins };
      });

      showSuccessAlert('Team member status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingStatus(false);
      setShowModalContainer(false);
    }
  }

  return (
    <div className={styles.status_update_modal}>
      <p>
        Are you sure you want to {actionPayload.action.toLowerCase()}{' '}
        {actionPayload.user.name}?
      </p>
      <div className={styles.buttons}>
        <button disabled={isUpdatingStatus} onClick={updateStatus}>
          Confirm
        </button>
        <button onClick={() => setShowModalContainer(false)}>Cancel</button>
      </div>
    </div>
  );
}
