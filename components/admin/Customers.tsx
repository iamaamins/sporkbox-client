import Link from "next/link";
import Archive from "./Archive";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import Modal from "@components/layout/Modal";
import { FormEvent, useState } from "react";
import styles from "@styles/admin/Customers.module.css";
import { IArchivePayload, ICustomersProps } from "types";
import {
  axiosInstance,
  convertDateToText,
  updateCustomers,
} from "@utils/index";

export default function Customers({ status, customers }: ICustomersProps) {
  // Hooks
  const router = useRouter();
  const { setCustomers } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<IArchivePayload>({
    action: "",
    data: {
      customerId: "",
      customerName: "",
    },
  });
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Handle update status
  function initiateStatusUpdate(e: FormEvent, customerId: string) {
    // Update states
    setShowArchiveModal(true);
    setPayload({
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
      setIsLoading(true);

      // Make request to the backend
      const response = await axiosInstance.put(
        `/customers/${payload.data.customerId}/status`,
        { action: payload.action }
      );

      // Update customers
      updateCustomers(response.data, setCustomers);
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove loader and close modal
      setIsLoading(false);
      setShowArchiveModal(false);
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

      <Modal
        showModal={showArchiveModal}
        setShowModal={setShowArchiveModal}
        component={
          <Archive
            name={payload.data.customerName}
            action={payload.action}
            isLoading={isLoading}
            updateStatus={updateStatus}
            setShowArchiveModal={setShowArchiveModal}
          />
        }
      />
    </>
  );
}
