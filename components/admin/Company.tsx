import { AxiosError } from "axios";
import Customers from "./Customers";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import ActionModal from "./ActionModal";
import { useAlert } from "@context/Alert";
import Buttons from "@components/layout/Buttons";
import { IAxiosError, ICompany, IScheduledRestaurant, IUser } from "types";
import styles from "@styles/admin/Company.module.css";
import { FormEvent, useEffect, useState } from "react";
import ModalContainer from "@components/layout/ModalContainer";
import ScheduleRestaurantsModal from "@components/admin/ScheduleRestaurantsModal";
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  sortByLastName,
  updateCompanies,
} from "@utils/index";
import ScheduledRestaurants from "./ScheduledRestaurants";

export default function Company() {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [action, setAction] = useState("");
  const [company, setCompany] = useState<ICompany>();
  const [showModal, setShowModal] = useState(false);
  const { companies, customers, setCompanies, scheduledRestaurants } =
    useData();
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [restaurants, setRestaurants] = useState<IScheduledRestaurant[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<IUser[]>([]);
  const [archivedCustomers, setArchivedCustomers] = useState<IUser[]>([]);
  const [isUpdatingCompanyStatus, setIsUpdatingCompanyStatus] = useState(false);

  // Get the company
  useEffect(() => {
    if (companies.data.length > 0 && router.isReady) {
      setCompany(
        companies.data.find((company) => company._id === router.query.company)
      );
    }
  }, [companies, router.isReady]);

  // Get customers and scheduled restaurants
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

    // Update scheduled restaurants
    setRestaurants(
      scheduledRestaurants.data.filter(
        (scheduledRestaurant) =>
          scheduledRestaurant.company._id === router.query.company
      )
    );
  }, [customers, scheduledRestaurants, router.isReady]);

  // Initiate status update
  function initiateStatusUpdate(e: FormEvent) {
    // Update states
    setShowStatusUpdateModal(true);
    setAction(e.currentTarget.textContent!);
  }

  // Update company status
  async function updateStatus() {
    try {
      // Show loader
      setIsUpdatingCompanyStatus(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/companies/${company?._id}/change-company-status`,
        {
          action,
        }
      );

      // Update companies
      updateCompanies(response.data, setCompanies);

      // Show success alert
      showSuccessAlert("Status updated", setAlerts);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader and close the modal
      setIsUpdatingCompanyStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  return (
    <>
      {companies.isLoading && (
        <section className={styles.section}>
          <h2>Loading...</h2>
        </section>
      )}

      {!companies.isLoading && !company && (
        <section className={styles.section}>
          <h2>No company found</h2>
        </section>
      )}

      {company && (
        <>
          <section className={styles.section}>
            <div className={styles.details}>
              <h2 className={styles.company_name}>{company.name}</h2>
              <p>
                <span>Code:</span> {company.code}
              </p>
              <p>
                <span>Daily budget:</span> USD ${company.dailyBudget}
              </p>
              <p>
                <span>Address:</span>{" "}
                {company.address.addressLine2 ? (
                  <>
                    {company.address.addressLine1},{" "}
                    {company.address.addressLine2}, {company.address.city},{" "}
                    {company.address.state} {company.address.zip}
                  </>
                ) : (
                  <>
                    {company.address.addressLine1}, {company.address.city},{" "}
                    {company.address.state} {company.address.zip}
                  </>
                )}
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
          </section>

          {/* Scheduled restaurants */}
          {restaurants.length > 0 && (
            <ScheduledRestaurants
              restaurants={restaurants}
              isLoading={scheduledRestaurants.isLoading}
            />
          )}

          {/* Active customers */}
          {activeCustomers.length > 0 && (
            <section className={styles.section}>
              <h2>Active customers</h2>
              <Customers status="active" customers={activeCustomers} />
            </section>
          )}

          {/* Archived customers */}
          {archivedCustomers.length > 0 && (
            <section className={styles.section}>
              <h2>Archived customers</h2>

              <Customers status="archived" customers={archivedCustomers} />
            </section>
          )}

          {/* Archive company modal */}
          <ModalContainer
            showModalContainer={showStatusUpdateModal}
            setShowModalContainer={setShowStatusUpdateModal}
            component={
              <ActionModal
                name={company.name}
                action={action}
                performAction={updateStatus}
                isPerformingAction={isUpdatingCompanyStatus}
                setShowActionModal={setShowStatusUpdateModal}
              />
            }
          />
        </>
      )}

      {/* Schedule restaurants modal */}
      <ModalContainer
        showModalContainer={showModal}
        setShowModalContainer={setShowModal}
        component={<ScheduleRestaurantsModal />}
      />
    </>
  );
}
