import Link from "next/link";
import { useRouter } from "next/router";
import { ICustomersProps } from "types";
import { convertDateToText } from "@utils/index";
import styles from "@styles/admin/Customers.module.css";
import { useState } from "react";
import Modal from "@components/layout/Modal";

export default function Customers({ status, customers }: ICustomersProps) {
  // Hooks
  const router = useRouter();

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
              <span className={`${styles.button} ${styles.change_status}`}>
                {status === "active" ? "Archive" : "Activate"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
