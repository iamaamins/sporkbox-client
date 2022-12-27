import { ICompany, ICustomers } from "types";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import Customers from "./Customers";
import { axiosInstance } from "@utils/index";
import Modal from "@components/layout/Modal";
import Buttons from "@components/layout/Buttons";
import { FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/Company.module.css";
import ScheduleRestaurants from "@components/admin/ScheduleRestaurants";

export default function Company() {
  // Hooks
  const router = useRouter();
  const { companies, setCompanies } = useData();
  const [company, setCompany] = useState<ICompany>();
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState<ICustomers>({
    data: [],
    isLoading: true,
  });

  // Get the company
  useEffect(() => {
    if (companies.data.length > 0 && router.isReady) {
      setCompany(
        companies.data.find((company) => company._id === router.query.company)
      );
    }
  }, [companies, router.isReady]);

  // Get customers
  useEffect(() => {
    async function getCustomers() {
      try {
        // Make request to the backend
        const response = await axiosInstance.get(
          `/customers/${router.query.company}`
        );

        // Update customers
        setCustomers((currState) => ({
          ...currState,
          isLoading: false,
          data: response.data,
        }));
      } catch (err) {
        console.log(err);
        setCustomers((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }
    }

    // Get customers when router is ready
    if (router.isReady) {
      getCustomers();
    }
  }, [router.isReady]);

  // Delete company
  async function handleDelete(e: FormEvent) {
    e.preventDefault();

    try {
      // Make delete request to backend
      await axiosInstance.delete(`/companies/${company?._id}`);

      // Update state
      setCompanies((currState) => ({
        ...currState,
        data: currState.data.filter(
          (currCompany) => currCompany._id !== company?._id
        ),
      }));

      // Back to companies page
      router.back();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.company}>
      {companies.isLoading && <h2>Loading...</h2>}

      {!companies.isLoading && !company && <h2>No company found</h2>}

      {company && (
        <>
          <div className={styles.details}>
            <h2 className={styles.company_name}>{company.name}</h2>
            <p>
              <span>Code:</span> {company.code}
            </p>
            <p>
              <span>Daily budget:</span> USD ${company.dailyBudget}
            </p>
            <p>
              <span>Address:</span> {company.address}
            </p>
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <Buttons
              handleClick={handleDelete}
              linkText="Edit details"
              buttonText="Delete"
              href={`/admin/companies/${router.query.company}/edit-company`}
            />

            <button
              onClick={() => setShowModal(true)}
              className={styles.schedule_restaurants_button}
            >
              Schedule restaurants
            </button>
          </div>

          <div className={styles.customers}>
            {customers.data.filter((customer) => customer.status === "ACTIVE")
              .length > 0 && (
              <div className={styles.section}>
                <h2>Active customers</h2>
                <Customers
                  status="active"
                  customers={customers.data.filter(
                    (customer) => customer.status === "ACTIVE"
                  )}
                />
              </div>
            )}

            {customers.data.filter((customer) => customer.status === "ARCHIVED")
              .length > 0 && (
              <div className={styles.section}>
                <h2>Archived customers</h2>

                <Customers
                  status="archived"
                  customers={customers.data.filter(
                    (customer) => customer.status === "ARCHIVED"
                  )}
                />
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        component={<ScheduleRestaurants />}
      />
    </section>
  );
}
