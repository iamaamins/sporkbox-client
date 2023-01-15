import Link from "next/link";
import { AxiosError } from "axios";
import ActionModal from "./ActionModal";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { FormEvent, useState } from "react";
import {
  axiosInstance,
  convertDateToText,
  showErrorAlert,
  showSuccessAlert,
  updateCustomers,
} from "@utils/index";
import { IAxiosError, ICustomersProps } from "types";
import styles from "@styles/admin/Customers.module.css";
import ModalContainer from "@components/layout/ModalContainer";

export default function Customers({ status, customers }: ICustomersProps) {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setCustomers } = useData();
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: "",
    data: {
      customerId: "",
      customerName: "",
    },
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isUpdatingCustomerStatus, setIsUpdatingCustomerStatus] =
    useState(false);

  // Handle update status
  function initiateStatusUpdate(e: FormEvent, customerId: string) {
    // Update states
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

  // Update customer status
  async function updateStatus() {
    try {
      // Show loader
      setIsUpdatingCustomerStatus(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/customers/${statusUpdatePayload.data.customerId}/change-customer-status`,
        { action: statusUpdatePayload.action }
      );

      // Update customers
      updateCustomers(response.data, setCustomers);

      // Show success alert
      showSuccessAlert("Status updated", setAlerts);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader and close modal
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
                {convertDateToText(customer.createdAt)}
              </td>
              <td>
                <Link
                  href={`/admin/companies/${router.query.company}/${customer._id}/edit-customer`}
                >
                  <a className={`${styles.button} ${styles.edit_details}`}>
                    Edit
                  </a>
                </Link>
                <span
                  className={`${styles.button} ${styles.change_status}`}
                  onClick={(e) => initiateStatusUpdate(e, customer._id)}
                >
                  {status === "active" ? "Archive" : "Activate"}
                </span>
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
