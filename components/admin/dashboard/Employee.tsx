import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import {
  axiosInstance,
  dateToText,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomAxiosError, Customer, Order } from 'types';
import styles from './Employee.module.css';
import ModalContainer from '@components/layout/ModalContainer';
import ActionModal from '../layout/ActionModal';
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
        `/users/${statusUpdatePayload.data.employeeId}/change-user-status`,
        { action: statusUpdatePayload.action }
      );

      setCustomers((prevState) => ({
        ...prevState,
        data: prevState.data.map((customer) => {
          if (customer._id !== response.data._id) return customer;
          return { ...customer, status: response.data.status };
        }),
      }));

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
  }, [customers, allUpcomingOrders, router]);

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
                <th className={styles.hide_on_mobile}>Email</th>
                <th className={styles.hide_on_mobile}>Company code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {employee.data.firstName} {employee.data.lastName}
                </td>
                <td className={styles.hide_on_mobile}>{employee.data.email}</td>
                <td className={styles.hide_on_mobile}>
                  {employee.data.companies[0].code}
                </td>
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
          <Orders hasOrderAction={true} orders={employee.upcomingOrders} />
        </section>
      )}
      {employee.deliveredOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Delivered orders</h2>
          <Orders orders={employee.deliveredOrders} />
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

type Props = { orders: Order[]; hasOrderAction?: boolean };
function Orders({ orders, hasOrderAction }: Props) {
  const { setAlerts } = useAlert();
  const { setAllUpcomingOrders } = useData();
  const [showOrderArchiveModal, setShowOrderArchiveModal] = useState(false);
  const [orderArchivePayload, setOrderArchivePayload] = useState({
    orderId: '',
    itemName: '',
  });
  const [isArchivingOrder, setIsArchivingOrder] = useState(false);

  const hasOptionalAddons = orders.some((order) => order.item.optionalAddons);
  const hasRequiredAddons = orders.some((order) => order.item.requiredAddons);
  const hasRemovedIngredients = orders.some(
    (order) => order.item.removedIngredients
  );

  function initiateOrderArchive(order: Order) {
    setShowOrderArchiveModal(true);
    setOrderArchivePayload({ orderId: order._id, itemName: order.item.name });
  }

  async function archiveOrder() {
    try {
      setIsArchivingOrder(true);
      const response = await axiosInstance.patch(
        `/orders/${orderArchivePayload.orderId}/archive`
      );
      setAllUpcomingOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter((el) => el._id !== response.data._id),
      }));
      showSuccessAlert('Order archived', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setShowOrderArchiveModal(false);
      setIsArchivingOrder(false);
    }
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            {hasOptionalAddons && (
              <th className={styles.hide_on_mobile}>Optional addons</th>
            )}
            {hasRequiredAddons && (
              <th className={styles.hide_on_mobile}>Required addons</th>
            )}
            {hasRemovedIngredients && (
              <th className={styles.hide_on_mobile}>Removed</th>
            )}
            <th className={styles.hide_on_mobile}>Quantity</th>
            <th className={styles.hide_on_mobile}>Restaurant</th>
            <th>Price</th>
            {hasOrderAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{dateToText(order.delivery.date)}</td>
              <td>{order.item.name}</td>
              {hasOptionalAddons && (
                <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                  {order.item.optionalAddons}
                </td>
              )}
              {hasRequiredAddons && (
                <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                  {order.item.requiredAddons}
                </td>
              )}
              {hasRemovedIngredients && (
                <td
                  className={`${styles.hide_on_mobile} ${styles.removed_ingredients}`}
                >
                  {order.item.removedIngredients}
                </td>
              )}
              <td className={styles.hide_on_mobile}>{order.item.quantity}</td>
              <td className={styles.hide_on_mobile}>{order.restaurant.name}</td>
              <td>{numberToUSD(order.item.total)}</td>
              {hasOrderAction && order.status === 'PROCESSING' && (
                <td>
                  <span
                    onClick={() => initiateOrderArchive(order)}
                    className={styles.action}
                  >
                    Archive
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ModalContainer
        showModalContainer={showOrderArchiveModal}
        setShowModalContainer={setShowOrderArchiveModal}
        component={
          <ActionModal
            name={orderArchivePayload.itemName}
            action='Archive'
            performAction={archiveOrder}
            isPerformingAction={isArchivingOrder}
            setShowActionModal={setIsArchivingOrder}
          />
        }
      />
    </>
  );
}
