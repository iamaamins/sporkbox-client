import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateCustomers,
} from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomAxiosError, Customer, Order } from 'types';
import EmployeeOrders from './EmployeeOrders';
import styles from './Employee.module.css';
import ModalContainer from '@components/layout/ModalContainer';
import ActionModal from './ActionModal';
import Link from 'next/link';

type EmployeeWithOrders = {
  data: Customer | null;
  upcomingOrders: Order[];
  deliveredOrders: Order[];
};

export default function Employee() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, allUpcomingOrders, setCustomers } = useData();
  const [employee, setEmployee] = useState<EmployeeWithOrders>({
    data: null,
    upcomingOrders: [],
    deliveredOrders: [],
  });
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: '',
    data: {
      employeeId: '',
      employeeName: '',
    },
  });
  const [isUpdatingEmployeeStatus, setIsUpdatingEmployeeStatus] =
    useState(false);

  function initiateStatusUpdate(employee: Customer | null) {
    if (!employee) return showErrorAlert('Employee not found', setAlerts);
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      action: employee.status === 'ACTIVE' ? 'Archive' : 'Activate',
      data: {
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
      },
    });
  }

  async function updateEmployeeStatus() {
    try {
      setIsUpdatingEmployeeStatus(true);
      const response = await axiosInstance.patch(
        `/customers/${statusUpdatePayload.data.employeeId}/change-customer-status`,
        { action: statusUpdatePayload.action }
      );
      updateCustomers(response.data, setCustomers);
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingEmployeeStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  // Get employee data, upcoming orders and delivered orders
  useEffect(() => {
    async function getEmployeeData() {
      try {
        const employee = customers.data.find(
          (customer) => customer._id === router.query.employee
        );
        if (!employee) return showErrorAlert('Employee not found', setAlerts);

        const upcomingOrders = allUpcomingOrders.data.filter(
          (upcomingOrder) => upcomingOrder.customer._id === employee._id
        );
        setEmployee((prevState) => ({
          ...prevState,
          data: employee,
          upcomingOrders,
        }));

        const response = await axiosInstance.get(
          `/orders/${employee._id}/all-delivered-orders`
        );
        const deliveredOrders = response.data;
        setEmployee((prevState) => ({
          ...prevState,
          deliveredOrders,
        }));
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady && customers.data.length) getEmployeeData();
  }, [router.isReady, customers, allUpcomingOrders]);

  return (
    <>
      <section className={styles.container}>
        <h2>
          {customers.isLoading
            ? 'Loading...'
            : !customers.isLoading && !employee
            ? 'No employee found'
            : 'General'}
        </h2>
        {employee.data && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {employee.data.firstName} {employee.data.lastName}
                </td>
                <td>{employee.data.email}</td>
                <td>{employee.data.companies[0].code}</td>
                <td>
                  <span
                    onClick={() => initiateStatusUpdate(employee.data)}
                    className={styles.action}
                  >
                    {employee.data.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </span>
                  {employee.data.status === 'ACTIVE' && (
                    <Link
                      href={`/admin/dashboard/${router.query.employee}/place-order/date`}
                    >
                      <a className={styles.place_order}>Place orders</a>
                    </Link>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
      {employee.upcomingOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Upcoming orders</h2>
          <EmployeeOrders
            hasOrderAction={true}
            orders={employee.upcomingOrders}
          />
        </section>
      )}
      {employee.deliveredOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Delivered orders</h2>
          <EmployeeOrders orders={employee.deliveredOrders} />
        </section>
      )}
      <ModalContainer
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
        component={
          <ActionModal
            name={statusUpdatePayload.data.employeeName}
            action={statusUpdatePayload.action}
            performAction={updateEmployeeStatus}
            isPerformingAction={isUpdatingEmployeeStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />
    </>
  );
}
