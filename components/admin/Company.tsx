import { ICompany, ICustomers, IUser } from "types";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import Customers from "./Customers";
import { axiosInstance, sortByLastName } from "@utils/index";
import Modal from "@components/layout/Modal";
import Buttons from "@components/layout/Buttons";
import { FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/Company.module.css";
import ScheduleRestaurants from "@components/admin/ScheduleRestaurants";
import Archive from "./Archive";

export default function Company() {
  // Hooks
  const router = useRouter();
  const [action, setAction] = useState("");
  const [company, setCompany] = useState<ICompany>();
  const [showModal, setShowModal] = useState(false);
  const { companies, setCompanies, customers } = useData();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [activeCustomers, setActiveCustomers] = useState<IUser[]>([]);
  const [archivedCustomers, setArchivedCustomers] = useState<IUser[]>([]);

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
    if (customers.data.length > 0 && router.isReady) {
      // Update active customers
      setActiveCustomers(
        customers.data
          .filter(
            (customer) =>
              customer.company?._id === router.query.company &&
              customer.status === "ACTIVE"
          )
          .sort(sortByLastName)
      );

      // Update archived customers
      setArchivedCustomers(
        customers.data
          .filter(
            (customer) =>
              customer.company?._id === router.query.company &&
              customer.status === "ARCHIVED"
          )
          .sort(sortByLastName)
      );
    }
  }, [customers, router.isReady]);

  // Initiate status update
  function initiateStatusUpdate(e: FormEvent) {
    // Update states
    setShowArchiveModal(true);
    setAction(e.currentTarget.textContent!);
  }

  // Update company status
  async function updateStatus() {
    try {
      const response = await axiosInstance.put(
        `/companies/${company?._id}/status`,
        {
          action,
        }
      );

      // Update state
      setCompanies((currState) => ({
        ...currState,
        data: currState.data.map((company) => {
          if (company._id === response.data._id) {
            return {
              ...company,
              status: response.data.status,
            };
          } else {
            return company;
          }
        }),
      }));
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove modal
      setShowArchiveModal(false);
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
              initiateStatusUpdate={initiateStatusUpdate}
              linkText="Edit details"
              buttonText={
                company.status === "ARCHIVED" ? "Activate" : "Archive"
              }
              href={`/admin/companies/${router.query.company}/edit-company`}
            />

            <button
              onClick={() => setShowModal(true)}
              className={styles.schedule_restaurants_button}
            >
              Schedule restaurants
            </button>
          </div>

          {/* Customers */}
          <div className={styles.customers}>
            {activeCustomers.length > 0 && (
              <div className={styles.section}>
                <h2>Active customers</h2>
                <Customers status="active" customers={activeCustomers} />
              </div>
            )}

            {archivedCustomers.length > 0 && (
              <div className={styles.section}>
                <h2>Archived customers</h2>

                <Customers status="archived" customers={archivedCustomers} />
              </div>
            )}
          </div>

          {/* Archive company modal */}
          <Modal
            showModal={showArchiveModal}
            setShowModal={setShowArchiveModal}
            component={
              <Archive
                name={company.name}
                action={action}
                setShowArchiveModal={setShowArchiveModal}
                updateStatus={updateStatus}
              />
            }
          />
        </>
      )}

      {/* Schedule restaurants modal */}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        component={<ScheduleRestaurants />}
      />
    </section>
  );
}
