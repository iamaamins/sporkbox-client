import { useAlert } from '@context/Alert';
import {
  axiosInstance,
  dateToText,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CustomAxiosError, Customer, Guest, Order } from 'types';
import styles from './User.module.css';
import ModalContainer from '@components/layout/ModalContainer';
import ActionModal from '@components/admin/layout/ActionModal';
import Link from 'next/link';
import { useUser } from '@context/User';

type UserWithOrders = {
  isLoading: boolean;
  data: Customer | Guest | null;
  upcomingOrders: Order[];
  deliveredOrders: Order[];
};

export default function User() {
  const router = useRouter();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [user, setUser] = useState<UserWithOrders>({
    isLoading: true,
    data: null,
    upcomingOrders: [],
    deliveredOrders: [],
  });
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionPayload, setActionPayload] = useState({
    action: '',
    data: {
      userId: '',
      username: '',
    },
  });
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  function initiateAction(user: Customer | Guest | null) {
    if (!user) return;

    setShowActionModal(true);
    setActionPayload({
      action: user.status === 'ACTIVE' ? 'Archive' : 'Activate',
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

      setUser((prevState) => ({ ...prevState, data: response.data }));
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsPerformingAction(false);
      setShowActionModal(false);
    }
  }

  // Get user data, upcoming orders and delivered orders
  useEffect(() => {
    async function getUserData(customer: Customer) {
      try {
        const response = await axiosInstance.get(
          `/users/${customer.companies[0].code}/${router.query.user}/data`
        );

        setUser({ isLoading: false, ...response.data });
      } catch (err) {
        setUser((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady && customer) getUserData(customer);
  }, [customer, router]);

  return (
    <>
      <section className={styles.container}>
        <h2>
          {user.isLoading
            ? 'Loading...'
            : !user.isLoading && !user.data
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
                    onClick={() => initiateAction(user.data)}
                    className={styles.action}
                  >
                    {user.data.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </button>
                  {user.data.status === 'ACTIVE' && (
                    <Link
                      href={`/company/${router.query.user}/place-order/date`}
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
          <Orders
            orders={user.upcomingOrders}
            setUser={setUser}
            hasOrderAction={true}
          />
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
            name={actionPayload.data.username}
            action={actionPayload.action}
            performAction={updateUserStatus}
            isPerformingAction={isPerformingAction}
            setShowActionModal={setShowActionModal}
          />
        }
      />
    </>
  );
}

type Props = {
  orders: Order[];
  hasOrderAction?: boolean;
  setUser?: Dispatch<SetStateAction<UserWithOrders>>;
};

function Orders({ orders, setUser, hasOrderAction }: Props) {
  const { setAlerts } = useAlert();
  const [showActionModal, setShowActionModal] = useState(false);
  const [orderActionPayload, setActionPayload] = useState({
    orderId: '',
    itemName: '',
  });
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  function initiateOrderArchive(order: Order) {
    setShowActionModal(true);
    setActionPayload({ orderId: order._id, itemName: order.item.name });
  }

  const hasOptionalAddons = orders.some((order) => order.item.optionalAddons);

  const hasRequiredAddons = orders.some((order) => order.item.requiredAddons);

  const hasRemovedIngredients = orders.some(
    (order) => order.item.removedIngredients
  );

  async function archiveOrder() {
    if (!setUser) return;

    try {
      setIsPerformingAction(true);

      const response = await axiosInstance.patch(
        `/orders/${orderActionPayload.orderId}/archive`
      );

      setUser((prevState) => ({
        ...prevState,
        upcomingOrders: prevState.upcomingOrders.filter(
          (order) => order._id !== response.data._id
        ),
      }));

      showSuccessAlert('Order archived', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setShowActionModal(false);
      setIsPerformingAction(false);
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
        showModalContainer={showActionModal}
        setShowModalContainer={setShowActionModal}
        component={
          <ActionModal
            name={orderActionPayload.itemName}
            action='Archive'
            performAction={archiveOrder}
            isPerformingAction={isPerformingAction}
            setShowActionModal={setIsPerformingAction}
          />
        }
      />
    </>
  );
}
