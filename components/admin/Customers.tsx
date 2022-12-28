import Link from "next/link";
import { useRouter } from "next/router";
import { IArchivePayload, ICustomersProps } from "types";
import { FormEvent, useState } from "react";
import { useData } from "@context/Data";
import styles from "@styles/admin/Customers.module.css";
import { axiosInstance, convertDateToText } from "@utils/index";
import Modal from "@components/layout/Modal";
import Archive from "./Archive";

export default function Customers({ status, customers }: ICustomersProps) {
  // Hooks
  const router = useRouter();
  const { setCustomers } = useData();
  const [payload, setPayload] = useState<IArchivePayload>({
    action: "",
    data: {
      customerId: "",
      customerName: "",
    },
  });
  const [showModal, setShowModal] = useState(false);

  // Handle update status
  function handleUpdateStatus(e: FormEvent, customerId: string) {
    // Update states
    setShowModal(true);
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
    // Update customer status
    try {
      // Make request to the backend
      const response = await axiosInstance.put(
        `/customers/${payload.data.customerId}/status`,
        { action: payload.action }
      );

      // Update customers
      setCustomers((currState) => ({
        ...currState,
        data: currState.data.map((customer) => {
          if (customer._id === response.data._id) {
            return {
              ...customer,
              status: response.data.status,
            };
          } else {
            return customer;
          }
        }),
      }));
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Close modal
      setShowModal(false);
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
                  onClick={(e) => handleUpdateStatus(e, customer._id)}
                >
                  {status === "active" ? "Archive" : "Activate"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        component={
          <Archive
            name={payload.data.customerName}
            action={payload.action}
            updateStatus={updateStatus}
            setShowModal={setShowModal}
          />
        }
      />
    </>
  );
}
