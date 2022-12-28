import Link from "next/link";
import { useRouter } from "next/router";
import { ICustomersProps } from "types";
import { FormEvent } from "react";
import { useData } from "@context/Data";
import styles from "@styles/admin/Customers.module.css";
import { axiosInstance, convertDateToText } from "@utils/index";

export default function Customers({ status, customers }: ICustomersProps) {
  // Hooks
  const router = useRouter();
  const { setCustomers } = useData();

  // Handle update customer status
  async function handleUpdateStatus(e: FormEvent, customerId: string) {
    // Action
    const action = e.currentTarget.textContent;

    // Update customer status
    try {
      // Make request to the backend
      const response = await axiosInstance.put(
        `/customers/${customerId}/status`,
        { action }
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
      console.log(err);
    }
  }

  return (
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
  );
}
