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
import { CustomAxiosError, Customer, Guest, Order } from 'types';
import styles from './User.module.css';
import ModalContainer from '@components/layout/ModalContainer';
import ActionModal from '../layout/ActionModal';
import Link from 'next/link';

type UserWithOrders = {
  data: Customer | Guest | null;
  upcomingOrders: Order[];
  deliveredOrders: Order[];
};

export default function User() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, guests, allUpcomingOrders, setCustomers, setGuests } =
    useData();
  const [user, setUser] = useState<UserWithOrders>({
    data: null,
    upcomingOrders: [],
    deliveredOrders: [],
  });
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionPayload, setActionPayload] = useState({
    type: '',
    action: '',
    data: {
      userId: '',
      username: '',
    },
  });
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  function initiateAction(
    user: Customer | Guest | null,
    type: 'admin' | 'status'
  ) {
    if (!user) return;

    setShowActionModal(true);
    setActionPayload({
      type,
      action:
        type === 'admin'
          ? (user as Customer).isCompanyAdmin
            ? 'Remove'
            : 'Make'
          : user.status === 'ACTIVE'
          ? 'Archive'
          : 'Activate',
      data: {
        userId: user._id,
        username: `${user.firstName} ${user.lastName}`,
      },
    });
  }

  async function updateUserStatus() {
    try {
      setIsPerformingAction(true);

      const response = await axiosInstance.patch(
        `/users/${actionPayload.data.userId}/change-user-status`,
        { action: actionPayload.action }
      );

      if (response.data.role === 'CUSTOMER') {
        setCustomers((prevState) => ({
          ...prevState,
          data: prevState.data.map((customer) => {
            if (customer._id !== response.data._id) return customer;
            return { ...customer, status: response.data.status };
          }),
        }));
      }

      if (response.data.role === 'GUEST') {
        setGuests((prevState) => ({
          ...prevState,
          data: prevState.data.map((guest) => {
            if (guest._id !== response.data._id) return guest;
            return { ...guest, status: response.data.status };
          }),
        }));
      }

      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsPerformingAction(false);
      setShowActionModal(false);
    }
  }

  async function updateCompanyAdmin() {
    try {
      setIsPerformingAction(true);

      const response = await axiosInstance.patch(
        `/customers/${actionPayload.data.userId}/update-company-admin`,
        { action: actionPayload.action }
      );

      setCustomers((prevState) => ({
        ...prevState,
        data: prevState.data.map((customer) => {
          if (customer._id !== response.data._id) return customer;
          return { ...customer, isCompanyAdmin: response.data.isCompanyAdmin };
        }),
      }));

      showSuccessAlert('Updated company admin', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsPerformingAction(false);
      setShowActionModal(false);
    }
  }

  // Get user data, upcoming orders and delivered orders
  useEffect(() => {
    async function getUserData() {
      try {
        const user = [...customers.data, ...guests.data].find(
          (user) => user._id === router.query.user
        );

        if (user) {
          const upcomingOrders = allUpcomingOrders.data.filter(
            (upcomingOrder) => upcomingOrder.customer._id === user._id
          );
          const response = await axiosInstance.get(
            `/orders/${user._id}/all-delivered-orders`
          );

          setUser((prevState) => ({
            ...prevState,
            data: user,
            upcomingOrders,
            deliveredOrders: response.data,
          }));
        }
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady && customers.data.length) getUserData();
  }, [customers, guests, allUpcomingOrders, router]);

  return (
    <>
      <section className={styles.container}>
        <h2>
          {customers.isLoading
            ? 'Loading...'
            : !customers.isLoading && !user
            ? 'No user found'
            : 'General'}
        </h2>
        {user.data && (
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
                  {user.data.firstName} {user.data.lastName}
                </td>
                <td className={styles.hide_on_mobile}>{user.data.email}</td>
                <td className={styles.hide_on_mobile}>
                  {user.data.companies[0].code}
                </td>
                <td>
                  <button
                    onClick={() => initiateAction(user.data, 'status')}
                    className={styles.action}
                  >
                    {user.data.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </button>
                  {user.data.status === 'ACTIVE' &&
                    user.data.role === 'CUSTOMER' && (
                      <button
                        className={styles.admin_action}
                        onClick={() => initiateAction(user.data, 'admin')}
                      >
                        {(user.data as Customer).isCompanyAdmin
                          ? 'Remove as admin'
                          : 'Make admin'}
                      </button>
                    )}
                  {user.data.status === 'ACTIVE' && (
                    <Link
                      href={`/admin/dashboard/${router.query.user}/place-order/date`}
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
      {user.upcomingOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Upcoming orders</h2>
          <Orders hasOrderAction={true} orders={user.upcomingOrders} />
        </section>
      )}
      {user.deliveredOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Delivered orders</h2>
          <Orders orders={user.deliveredOrders} />
        </section>
      )}
      <ModalContainer
        showModalContainer={showActionModal}
        setShowModalContainer={setShowActionModal}
        component={
          <ActionModal
            name={
              actionPayload.type === 'admin'
                ? `${actionPayload.data.username} as company admin`
                : actionPayload.data.username
            }
            action={actionPayload.action}
            performAction={
              actionPayload.type === 'admin'
                ? updateCompanyAdmin
                : updateUserStatus
            }
            isPerformingAction={isPerformingAction}
            setShowActionModal={setShowActionModal}
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
  const hasExtraRequiredAddons = orders.some(
    (order) => order.item.extraRequiredAddons
  );
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
              <th className={styles.hide_on_mobile}>Req. add-on 1</th>
            )}
            {hasExtraRequiredAddons && (
              <th className={styles.hide_on_mobile}>Req. add-on 2</th>
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
              {hasExtraRequiredAddons && (
                <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                  {order.item.extraRequiredAddons}
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
                  <button
                    onClick={() => initiateOrderArchive(order)}
                    className={styles.action}
                  >
                    Archive
                  </button>
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
