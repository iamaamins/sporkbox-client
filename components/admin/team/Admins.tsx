import { useEffect, useState } from 'react';
import styles from './Admins.module.css';
import { Admin, CustomAxiosError } from 'types';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import { useAlert } from '@context/Alert';
import { useUser } from '@context/User';
import LinkButton from '@components/layout/LinkButton';

type Admins = {
  isLoading: boolean;
  data: Admin[] | null;
};

export default function Admins() {
  const { setAlerts } = useAlert();
  const { isAdmin } = useUser();
  const [admins, setAdmins] = useState<Admins>({ isLoading: true, data: null });

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <LinkButton href='/admin/team/add' linkText='Add admin' />
    </section>
  );
}
