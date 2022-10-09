import axios from "axios";
import Link from "next/link";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@styles/admin/Company.module.css";

export default function Company() {
  // Hooks
  const router = useRouter();
  const { companies, setCompanies } = useData();
  const [company, setCompany] = useState(null);

  // Get the company
  useEffect(() => {
    if (companies) {
      setCompany(
        companies.find((company) => company._id === router.query.company)
      );
    }
  }, [companies]);

  // Delete company
  async function handleDelete(e) {
    e.preventDefault();

    try {
      // Make delete request to backend
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${router.query.company}`,
        {
          withCredentials: true,
        }
      );

      // Successfully deleted message
      console.log(res.data.message);

      // Update state
      setCompanies((prevCompanies) =>
        prevCompanies.filter(
          (prevCompany) => prevCompany._id !== router.query.company
        )
      );

      // Back to companies page
      router.back();
    } catch (err) {
      console.log(err.response);
    }
  }

  return (
    <section className={styles.company}>
      {!company && <h2>No company</h2>}

      {company && (
        <>
          <div className={styles.details}>
            <h2>{company.name}</h2>
            <p>
              <span>Code:</span> {company.code}
            </p>
            <p>
              <span>Weekly budget:</span> {company.budget}
            </p>
            <p>
              <span>Address:</span> {company.address}
            </p>
          </div>

          <div className={styles.buttons}>
            <Link href="/">
              <a className={styles.edit_button}>Edit details</a>
            </Link>

            <button onClick={handleDelete} className={styles.delete_button}>
              Delete
            </button>
          </div>
        </>
      )}
    </section>
  );
}
