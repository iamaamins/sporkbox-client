import Link from 'next/link';
import ActionModal from './ActionModal';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import { FormEvent, useState } from 'react';
import {
  axiosInstance,
  dateToText,
  showErrorAlert,
  showSuccessAlert,
  updateCustomers,
} from '@lib/utils';
import { CustomAxiosError, Customer } from 'types';
import styles from './Customers.module.css';
import ModalContainer from '@components/layout/ModalContainer';

type Props = { status?: string; customers: Customer[] };

export default function Customers({ status, customers }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setCustomers } = useData();
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: '',
    data: {
      customerId: '',
      customerName: '',
    },
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isUpdatingCustomerStatus, setIsUpdatingCustomerStatus] =
    useState(false);

  function initiateStatusUpdate(e: FormEvent, customerId: string) {
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      action: e.currentTarget.textContent!,
      data: {
        customerId,
        customerName: customers.find((customer) => customer._id === customerId)
          ?.firstName!,
      },
    });
  }

  async function updateStatus() {
    try {
      setIsUpdatingCustomerStatus(true);
      const response = await axiosInstance.patch(
        `/customers/${statusUpdatePayload.data.customerId}/change-customer-status`,
        { action: statusUpdatePayload.action }
      );
      updateCustomers(response.data, setCustomers);
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingCustomerStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  return (
    <>
      <table className={styles.customers}>
        <thead>
          <tr>
            <th>Name</th>
            <th className={styles.hide_on_mobile}>Email</th>
            <th className={styles.hide_on_mobile}>Registered</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td className={styles.important}>
                <Link
                  href={`/admin/companies/${router.query.company}/${customer._id}`}
                >
                  <a>
                    {customer.firstName} {customer.lastName}
                  </a>
                </Link>
              </td>
              <td className={styles.hide_on_mobile}>{customer.email}</td>
              <td className={styles.hide_on_mobile}>
                {dateToText(customer.createdAt)}
              </td>
              <td>
                <Link
                  href={`/admin/companies/${router.query.company}/${customer._id}/edit-customer`}
                >
                  <a className={`${styles.button} ${styles.edit_details}`}>
                    Edit
                  </a>
                </Link>
                {status && (
                  <span
                    className={`${styles.button} ${styles.change_status}`}
                    onClick={(e) => initiateStatusUpdate(e, customer._id)}
                  >
                    {status === 'active' ? 'Archive' : 'Activate'}
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
            name={statusUpdatePayload.data.customerName}
            action={statusUpdatePayload.action}
            performAction={updateStatus}
            isPerformingAction={isUpdatingCustomerStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />
    </>
  );
}
