import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import {
  axiosInstance,
  groupIdenticalOrders,
  showErrorAlert,
  updateCustomers,
} from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomAxiosError, Customer, Order } from 'types';
import EmployeeOrders from './EmployeeOrders';
import styles from './Employee.module.css';
import ModalContainer from '@components/layout/ModalContainer';
import ActionModal from './ActionModal';

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

  async function getDeliveredOrders() {
    try {
      const response = await axiosInstance.get<Order[]>(
        `/orders/${router.query.employee}/all-delivered-orders`
      );
      setEmployee((prevState) => ({
        ...prevState,
        deliveredOrders: response.data,
      }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

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
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingEmployeeStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  // Get employee data and upcoming orders
  useEffect(() => {
    if (router.isReady && customers.data.length > 0) {
      const employee = customers.data.find(
        (customer) => customer._id === router.query.employee
      );

      if (employee) {
        setEmployee((prevState) => ({
          ...prevState,
          data: employee,
          upcomingOrders: allUpcomingOrders.data.filter(
            (upcomingOrder) =>
              upcomingOrder.customer._id === router.query.employee
          ),
        }));
      }
    }
    if (employee) getDeliveredOrders();
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {employee.data.firstName} {employee.data.lastName}
                </td>
                <td>{employee.data.email}</td>
                <td>
                  <span
                    onClick={() => initiateStatusUpdate(employee.data)}
                    className={styles.action}
                  >
                    {employee.data.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </span>
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
            orders={groupIdenticalOrders(employee.upcomingOrders)}
          />
        </section>
      )}
      {employee.deliveredOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Delivered orders</h2>
          <EmployeeOrders
            orders={groupIdenticalOrders(employee.deliveredOrders)}
          />
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
