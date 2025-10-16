import Users from './Users';
import { CSVLink } from 'react-csv';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import ActionModal from '../layout/ActionModal';
import { useAlert } from '@context/Alert';
import { FiDownload } from 'react-icons/fi';
import Buttons from '@components/layout/Buttons';
import styles from './Company.module.css';
import { FormEvent, useEffect, useState } from 'react';
import ScheduledRestaurants from '../home/ScheduledRestaurants';
import ModalContainer from '@components/layout/ModalContainer';
import ScheduleRestaurantsModal from '@components/admin/company/ScheduleRestaurantsModal';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  sortByLastName,
  updateCompanies,
} from '@lib/utils';
import {
  Company as CompanyType,
  Customer,
  CustomAxiosError,
  ScheduledRestaurant,
  Guest,
} from 'types';
import {
  formatCustomerDataToCSV,
  createCustomerCSVFileName,
  customerCSVHeaders,
} from '@lib/csv';
import ButtonLoader from '@components/layout/ButtonLoader';
import Link from 'next/link';

export default function Company() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [action, setAction] = useState('');
  const [company, setCompany] = useState<CompanyType>();
  const [showModal, setShowModal] = useState(false);
  const {
    companies,
    customers,
    guests,
    setCompanies,
    allUpcomingOrders,
    scheduledRestaurants,
  } = useData();
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [restaurants, setRestaurants] = useState<ScheduledRestaurant[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<Customer[]>([]);
  const [archivedCustomers, setArchivedCustomers] = useState<Customer[]>([]);
  const [isUpdatingCompanyStatus, setIsUpdatingCompanyStatus] = useState(false);
  const [unenrolledCustomers, setUnenrolledCustomers] = useState<Customer[]>(
    []
  );
  const [isSendingOrderReminder, setIsSendingOrderReminder] = useState(false);
  const [activeGuests, setActiveGuests] = useState<Guest[]>([]);
  const [archivedGuests, setArchivedGuests] = useState<Guest[]>([]);

  function initiateStatusUpdate(e: FormEvent) {
    setShowStatusUpdateModal(true);
    setAction(e.currentTarget.textContent!);
  }

  async function updateStatus() {
    try {
      setIsUpdatingCompanyStatus(true);
      const response = await axiosInstance.patch(
        `/companies/${company?._id}/update-status`,
        {
          action,
        }
      );
      updateCompanies(response.data, setCompanies);
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingCompanyStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  async function sendOrderReminder(code: string) {
    try {
      setIsSendingOrderReminder(true);
      const response = await axiosInstance.post('/email/time-to-order', {
        code,
      });
      showSuccessAlert(response.data.message, setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsSendingOrderReminder(false);
    }
  }

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
      setActiveCustomers(
        customers.data
          .filter(
            (customer) =>
              customer.status === 'ACTIVE' &&
              (customer.companies.some(
                (company) =>
                  company.status === 'ACTIVE' &&
                  company._id === router.query.company
              ) ||
                allUpcomingOrders.data.some(
                  (upcomingOrder) =>
                    upcomingOrder.customer._id === customer._id &&
                    upcomingOrder.company._id === router.query.company
                ))
          )
          .sort(sortByLastName)
      );
      setArchivedCustomers(
        customers.data
          .filter(
            (customer) =>
              customer.status === 'ARCHIVED' &&
              customer.companies.some(
                (company) => company._id === router.query.company
              )
          )
          .sort(sortByLastName)
      );
      setUnenrolledCustomers(
        customers.data
          .filter(
            (customer) =>
              customer.companies.some(
                (company) =>
                  company.status === 'ARCHIVED' &&
                  company._id === router.query.company
              ) &&
              !allUpcomingOrders.data.some(
                (upcomingOrder) =>
                  upcomingOrder.customer._id === customer._id &&
                  upcomingOrder.company._id === router.query.company
              )
          )
          .sort(sortByLastName)
      );
    }
  }, [customers, router.isReady]);

  // Get scheduled restaurants
  useEffect(() => {
    if (scheduledRestaurants.data.length > 0 && router.isReady) {
      setRestaurants(
        scheduledRestaurants.data.filter(
          (scheduledRestaurant) =>
            scheduledRestaurant.company._id === router.query.company
        )
      );
    }
  }, [scheduledRestaurants, router.isReady]);

  // Get guests
  useEffect(() => {
    if (guests.data.length > 0 && router.isReady) {
      setActiveGuests(
        guests.data.filter(
          (guest) =>
            guest.status === 'ACTIVE' &&
            guest.companies.some(
              (company) => company._id === router.query.company
            )
        )
      );
      setArchivedGuests(
        guests.data.filter(
          (guest) =>
            guest.status === 'ARCHIVED' &&
            guest.companies.some(
              (company) => company._id === router.query.company
            )
        )
      );
    }
  }, [guests, router.isReady]);

  return (
    <>
      {companies.isLoading && (
        <section className={styles.container}>
          <h2>Loading...</h2>
        </section>
      )}
      {!companies.isLoading && !company && (
        <section className={styles.container}>
          <h2>No company found</h2>
        </section>
      )}
      {company && (
        <>
          <section className={styles.container}>
            <div className={styles.details}>
              <h2 className={styles.company_name}>{company.name}</h2>
              <p className={styles.shift}>
                <span>Shift:</span> {company.shift}
              </p>
              <p>
                <span>Code:</span> {company.code}
              </p>
              <p>
                <span>Shift budget:</span> USD ${company.shiftBudget}
              </p>
              <p>
                <span>Address:</span>{' '}
                {company.address.addressLine2 ? (
                  <>
                    {company.address.addressLine1},{' '}
                    {company.address.addressLine2}, {company.address.city},{' '}
                    {company.address.state} {company.address.zip}
                  </>
                ) : (
                  <>
                    {company.address.addressLine1}, {company.address.city},{' '}
                    {company.address.state} {company.address.zip}
                  </>
                )}
              </p>
            </div>
            <div className={styles.buttons}>
              <Buttons
                initiateStatusUpdate={initiateStatusUpdate}
                linkText='Edit details'
                buttonText={
                  company.status === 'ARCHIVED' ? 'Activate' : 'Archive'
                }
                href={`/admin/companies/${router.query.company}/edit-company`}
              />
              <button
                onClick={() => setShowModal(true)}
                className={styles.schedule_restaurants_button}
              >
                Schedule restaurants
              </button>
              <button
                onClick={() => sendOrderReminder(company.code)}
                className={styles.order_reminder_button}
              >
                {isSendingOrderReminder ? (
                  <ButtonLoader />
                ) : (
                  'Send order reminders'
                )}
              </button>
              <Link href={`/admin/companies/${router.query.company}/add-guest`}>
                <a className={styles.add_guest_button}>Add guest</a>
              </Link>
              <CSVLink
                data={formatCustomerDataToCSV([
                  ...activeCustomers,
                  ...archivedCustomers,
                  ...unenrolledCustomers,
                ])}
                headers={customerCSVHeaders}
                filename={createCustomerCSVFileName(company)}
              >
                <button className={styles.customer_info_download_button}>
                  Customer info <FiDownload />
                </button>
              </CSVLink>
            </div>
          </section>
          {restaurants.length > 0 && (
            <ScheduledRestaurants
              restaurants={restaurants}
              isLoading={scheduledRestaurants.isLoading}
            />
          )}
          {activeCustomers.length > 0 && (
            <section className={styles.container}>
              <h2>Active customers</h2>
              <Users users={activeCustomers} role='CUSTOMER' status='ACTIVE' />
            </section>
          )}
          {archivedCustomers.length > 0 && (
            <section className={styles.container}>
              <h2>Archived customers</h2>
              <Users
                users={archivedCustomers}
                role='CUSTOMER'
                status='ARCHIVED'
              />
            </section>
          )}
          {unenrolledCustomers.length > 0 && (
            <section className={styles.container}>
              <h2>Unenrolled customers</h2>
              <Users users={unenrolledCustomers} role='CUSTOMER' />
            </section>
          )}
          {activeGuests.length > 0 && (
            <section className={styles.container}>
              <h2>Active guests</h2>
              <Users users={activeGuests} role='GUEST' status='ACTIVE' />
            </section>
          )}
          {archivedGuests.length > 0 && (
            <section className={styles.container}>
              <h2>Archived guests</h2>
              <Users users={archivedGuests} role='GUEST' status='ARCHIVED' />
            </section>
          )}
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
      <ModalContainer
        showModalContainer={showModal}
        setShowModalContainer={setShowModal}
        component={<ScheduleRestaurantsModal />}
      />
    </>
  );
}
