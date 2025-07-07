import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import ActionModal from '../layout/ActionModal';
import { useAlert } from '@context/Alert';
import { useEffect, useState } from 'react';
import { Order, CustomAxiosError, OrdersByRestaurant, OrderGroup } from 'types';
import {
  axiosInstance,
  dateToMS,
  showErrorAlert,
  showSuccessAlert,
  dateToText,
  numberToUSD,
  sortOrders,
  groupIdenticalOrders,
} from '@lib/utils';
import styles from './OrderGroupDetails.module.css';
import ModalContainer from '@components/layout/ModalContainer';

type Props = { isLoading: boolean; orderGroups: OrderGroup[] };
type DeliveryAction = 'deliver' | 'mark delivered';
type OrderDeliveryPayload = {
  action: DeliveryAction;
  orders: Order[];
  restaurantName: string;
};

export default function OrderGroupDetails({ isLoading, orderGroups }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState({
    paid: 0,
    total: 0,
    discount: 0,
  });
  const {
    allUpcomingOrders,
    setAllUpcomingOrders,
    allDeliveredOrders,
    setAllDeliveredOrders,
  } = useData();
  const [isDeliveringOrders, setIsDeliveringOrders] = useState(false);
  const [ordersByRestaurants, setOrdersByRestaurants] = useState<
    OrdersByRestaurant[]
  >([]);
  const [orderDeliveryPayload, setOrderDeliveryPayload] =
    useState<OrderDeliveryPayload>({
      action: 'deliver',
      orders: [],
      restaurantName: '',
    });
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchivingOrder, setIsArchivingOrder] = useState(false);

  function initiateOrdersDelivery(
    action: DeliveryAction,
    orders: Order[],
    restaurantName: string
  ) {
    setShowDeliveryModal(true);
    setOrderDeliveryPayload({ action, orders, restaurantName });
  }

  async function deliverOrders() {
    const orderIds = orderDeliveryPayload.orders.map((order) => order._id);

    try {
      setIsDeliveringOrders(true);

      await axiosInstance.patch('/orders/deliver', {
        action: orderDeliveryPayload.action,
        orderIds,
      });

      setOrdersByRestaurants((prevState) =>
        prevState.filter(
          (ordersByRestaurant) =>
            ordersByRestaurant.restaurantName !==
            orderDeliveryPayload.restaurantName
        )
      );

      setAllUpcomingOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter((order) => !orderIds.includes(order._id)),
      }));

      setAllDeliveredOrders((prevState) => ({
        ...prevState,
        data: [
          ...prevState.data,
          ...orderDeliveryPayload.orders.map((order) => ({
            ...order,
            status: 'DELIVERED',
          })),
        ],
      }));

      showSuccessAlert(
        orderDeliveryPayload.action === 'deliver'
          ? 'Orders delivered'
          : 'Orders marked as delivered',
        setAlerts
      );

      ordersByRestaurants.length === 1 && router.push('/admin');
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsDeliveringOrders(false);
      setShowDeliveryModal(false);
    }
  }

  async function archiveOrder() {
    try {
      setIsArchivingOrder(true);

      await axiosInstance.patch(`/orders/${orderId}/archive`);

      setAllUpcomingOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter((order) => order._id !== orderId),
      }));

      showSuccessAlert('Order archived', setAlerts);

      ordersByRestaurants
        .map((ordersByRestaurant) => ordersByRestaurant.orders)
        .flat().length === 1 && router.push('/admin');
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsArchivingOrder(false);
      setShowArchiveModal(false);
    }
  }

  const date = dateToText(+(router.query.date as string));

  const getOrdersQuantity = (orders: Order[]) =>
    orders.reduce((acc, curr) => acc + curr.item.quantity, 0);

  // Separate order for each restaurant
  useEffect(() => {
    if (!isLoading && router.isReady) {
      const orderGroup = orderGroups.find(
        (orderGroup) =>
          orderGroup.company.code === router.query.company &&
          dateToMS(orderGroup.deliveryDate).toString() === router.query.date
      );

      if (orderGroup) {
        const { company, deliveryDate, restaurants, orders } = orderGroup;
        setOrdersByRestaurants(
          restaurants.map((restaurant) => ({
            company: {
              name: company.name,
              shift: company.shift,
              code: company.code,
            },
            deliveryDate,
            restaurantName: restaurant,
            orders: orders
              .filter((order) => order.restaurant.name === restaurant)
              .sort(sortOrders),
          }))
        );
      }
    }
  }, [router.isReady, isLoading, orderGroups]);

  // Get amounts
  useEffect(() => {
    if (!allUpcomingOrders.isLoading && !allDeliveredOrders.isLoading) {
      const filterOrders = (order: Order) =>
        order.company.code === router.query.company &&
        dateToMS(order.delivery.date).toString() === router.query.date;

      const filteredOrders = [
        ...allUpcomingOrders.data.filter(filterOrders),
        ...allDeliveredOrders.data.filter(filterOrders),
      ];

      const paidOrders: Order[] = [];
      for (const order of filteredOrders) {
        if (order.payment) paidOrders.push(order);
      }
      setAmount({
        paid: paidOrders.reduce(
          (acc, curr) => acc + (curr.payment?.distributed || 0),
          0
        ),
        discount: filteredOrders.reduce(
          (acc, curr) => acc + (curr.discount?.distributed || 0),
          0
        ),
        total: filteredOrders.reduce((acc, curr) => acc + curr.item.total, 0),
      });
    }
  }, [allUpcomingOrders, allDeliveredOrders]);

  return (
    <section className={styles.container}>
      <h2>
        {isLoading
          ? 'Loading....'
          : !isLoading && ordersByRestaurants.length === 0 && 'No orders found'}
      </h2>

      {ordersByRestaurants.length > 0 && (
        <>
          <div>
            <h2>Order details - {date}</h2>
            <table>
              <thead>
                <tr>
                  <th className={styles.hide_on_mobile}>Date</th>
                  <th>Company code</th>
                  <th>Restaurant</th>
                  <th className={styles.hide_on_mobile}>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ordersByRestaurants.map((ordersByRestaurant, index) => (
                  <tr key={index}>
                    <td className={styles.hide_on_mobile}>
                      {dateToText(ordersByRestaurant.deliveryDate)}
                    </td>
                    <td>{ordersByRestaurant.company.code}</td>
                    <td>{ordersByRestaurant.restaurantName}</td>
                    <td className={styles.hide_on_mobile}>
                      {getOrdersQuantity(ordersByRestaurant.orders)}
                    </td>
                    <td>
                      {ordersByRestaurant.orders.every(
                        (order) => order.status === 'PROCESSING'
                      ) ? (
                        <div className={styles.delivery_buttons}>
                          <span
                            className={styles.deliver}
                            onClick={() =>
                              initiateOrdersDelivery(
                                'deliver',
                                ordersByRestaurant.orders,
                                ordersByRestaurant.restaurantName
                              )
                            }
                          >
                            Deliver
                          </span>
                          <span
                            className={styles.mark_delivered}
                            onClick={() =>
                              initiateOrdersDelivery(
                                'mark delivered',
                                ordersByRestaurant.orders,
                                ordersByRestaurant.restaurantName
                              )
                            }
                          >
                            Mark Delivered
                          </span>
                        </div>
                      ) : (
                        <span>Delivered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ordersByRestaurants.map((ordersByRestaurant, index) => (
            <div key={index}>
              <h2>
                Order summary - {ordersByRestaurant.restaurantName} - {date}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th className={styles.hide_on_mobile}>Shift</th>
                    <th>Dish</th>
                    <th className={styles.hide_on_mobile}>RA1</th>
                    <th className={styles.hide_on_mobile}>RA2</th>
                    <th className={styles.hide_on_mobile}>Optional addons</th>
                    <th className={styles.hide_on_mobile}>Removed</th>
                    <th>Item price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {groupIdenticalOrders(ordersByRestaurant.orders).map(
                    (group, index) => (
                      <tr key={index}>
                        <td
                          className={`${styles.hide_on_mobile} ${styles.shift}`}
                        >
                          {group.company.shift}
                        </td>
                        <td>{group.item.name}</td>
                        <td
                          className={`${styles.ingredients} ${styles.hide_on_mobile}`}
                        >
                          {group.item.requiredAddonsOne}
                        </td>
                        <td
                          className={`${styles.ingredients} ${styles.hide_on_mobile}`}
                        >
                          {group.item.requiredAddonsTwo}
                        </td>
                        <td
                          className={`${styles.ingredients} ${styles.hide_on_mobile}`}
                        >
                          {group.item.optionalAddons}
                        </td>
                        <td
                          className={`${styles.hide_on_mobile} ${styles.ingredients}`}
                        >
                          {group.item.removedIngredients}
                        </td>
                        <td>{numberToUSD(group.total)}</td>
                        <td>{group.quantity}</td>
                      </tr>
                    )
                  )}
                  <tr className={styles.total}>
                    <td>Total</td>
                    <td className={styles.hide_on_mobile}></td>
                    <td className={styles.hide_on_mobile}></td>
                    <td className={styles.hide_on_mobile}></td>
                    <td className={styles.hide_on_mobile}></td>
                    <td className={styles.hide_on_mobile}></td>
                    <td>
                      {numberToUSD(
                        ordersByRestaurant.orders.reduce(
                          (acc, curr) => acc + curr.item.total,
                          0
                        )
                      )}
                    </td>
                    <td>{getOrdersQuantity(ordersByRestaurant.orders)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          {ordersByRestaurants.map((ordersByRestaurant, index) => (
            <div key={index}>
              <h2>
                Customer information - {ordersByRestaurant.restaurantName} -{' '}
                {date}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className={styles.hide_on_mobile}>Email</th>
                    <th className={styles.hide_on_mobile}>Shift</th>
                    <th>Dish</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersByRestaurant.orders.map((order, index) => (
                    <tr key={index}>
                      <td>
                        {order.customer.firstName} {order.customer.lastName}
                      </td>
                      <td className={styles.hide_on_mobile}>
                        {order.customer.email}
                      </td>
                      <td
                        className={`${styles.hide_on_mobile} ${styles.shift}`}
                      >
                        {order.company.shift}
                      </td>
                      <td>{order.item.name}</td>
                      <td>
                        {order.status === 'PROCESSING' ? (
                          <span
                            className={styles.archive}
                            onClick={() => {
                              setOrderId(orderId);
                              setShowArchiveModal(true);
                            }}
                          >
                            Archive
                          </span>
                        ) : (
                          <span>Delivered</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div>
            <h2>Charge information - {date}</h2>
            <table>
              <thead>
                <tr>
                  <th>Reimbursed</th>
                  <th>Discount</th>
                  <th>Paid</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {numberToUSD(
                      amount.total - (amount.paid + amount.discount)
                    )}
                  </td>
                  <td>{numberToUSD(amount.discount)}</td>
                  <td>{numberToUSD(amount.paid)}</td>
                  <td>{numberToUSD(amount.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      <ModalContainer
        showModalContainer={showArchiveModal}
        setShowModalContainer={setShowArchiveModal}
        component={
          <ActionModal
            name='this order'
            action='archive'
            performAction={archiveOrder}
            isPerformingAction={isArchivingOrder}
            setShowActionModal={setShowArchiveModal}
          />
        }
      />
      <ModalContainer
        showModalContainer={showDeliveryModal}
        setShowModalContainer={setShowDeliveryModal}
        component={
          <ActionModal
            name='notifications'
            action={
              orderDeliveryPayload.action === 'deliver'
                ? 'deliver these orders and send'
                : 'deliver these orders without sending'
            }
            performAction={deliverOrders}
            isPerformingAction={isDeliveringOrders}
            setShowActionModal={setShowDeliveryModal}
          />
        }
      />
    </section>
  );
}
