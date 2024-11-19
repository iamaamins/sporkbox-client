import { CustomAxiosError, Order } from 'types';
import styles from './Employee.module.css';
import {
  axiosInstance,
  dateToText,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { useState } from 'react';
import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import ModalContainer from '@components/layout/ModalContainer';
import ActionModal from '../layout/ActionModal';

type Props = { orders: Order[]; hasOrderAction?: boolean };

export default function EmployeeOrders({ orders, hasOrderAction }: Props) {
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
            <th>Quantity</th>
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
              <td>{order.item.quantity}</td>
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
