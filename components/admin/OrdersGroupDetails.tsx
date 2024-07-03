import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import ActionModal from './ActionModal';
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
  groupIdenticalOrdersForAdmin,
} from '@lib/utils';
import styles from './OrdersGroupDetails.module.css';
import ModalContainer from '@components/layout/ModalContainer';

type Props = { isLoading: boolean; orderGroups: OrderGroup[] };
type DeliverOrdersPayload = { orders: Order[]; restaurantName: string };

export default function OrdersGroupDetails({ isLoading, orderGroups }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState({
    paid: 0,
    total: 0,
  });
  const {
    allUpcomingOrders,
    setAllUpcomingOrders,
    allDeliveredOrders,
    setAllDeliveredOrders,
  } = useData();
  const [isUpdatingOrdersStatus, setIsUpdatingOrdersStatus] = useState(false);
  const [ordersByRestaurants, setOrdersByRestaurants] = useState<
    OrdersByRestaurant[]
  >([]);
  const [statusUpdatePayload, setStatusUpdatePayload] =
    useState<DeliverOrdersPayload>({
      orders: [],
      restaurantName: '',
    });
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState(false);

  function initiateOrdersDelivery(orders: Order[], restaurantName: string) {
    setShowDeliveryModal(true);
    setStatusUpdatePayload({
      orders,
      restaurantName,
    });
  }

  async function deliverOrders() {
    const orderIds = statusUpdatePayload.orders.map((order) => order._id);

    try {
      setIsUpdatingOrdersStatus(true);
      await axiosInstance.patch('/orders/change-orders-status', {
        orderIds,
      });
      setOrdersByRestaurants((prevState) =>
        prevState.filter(
          (ordersByRestaurant) =>
            ordersByRestaurant.restaurantName !==
            statusUpdatePayload.restaurantName
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
          ...statusUpdatePayload.orders.map((order) => ({
            ...order,
            status: 'DELIVERED',
          })),
        ],
      }));
      showSuccessAlert('Orders delivered', setAlerts);
      ordersByRestaurants.length === 1 && router.push('/admin');
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingOrdersStatus(false);
      setShowDeliveryModal(false);
    }
  }

  function initiateStatusUpdate(orderId: string) {
    setShowStatusUpdateModal(true);
    setOrderId(orderId);
  }

  async function updateStatus() {
    try {
      setIsUpdatingOrderStatus(true);
      await axiosInstance.patch(`/orders/${orderId}/change-order-status`);
      setAllUpcomingOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter((order) => order._id !== orderId),
      }));
      showSuccessAlert('Order archived', setAlerts);
      ordersByRestaurants
        .map((ordersByRestaurant) => ordersByRestaurant.orders)
        .flat().length === 1 && router.push('/admin');
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingOrderStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  const date = dateToText(+(router.query.date as string));

  const hasOptionalAddons = (ordersByRestaurant: OrdersByRestaurant) =>
    ordersByRestaurant.orders.some((order) => order.item.optionalAddons);

  const hasRequiredAddons = (ordersByRestaurant: OrdersByRestaurant) =>
    ordersByRestaurant.orders.some((order) => order.item.requiredAddons);

  const hasRemovedIngredients = (ordersByRestaurant: OrdersByRestaurant) =>
    ordersByRestaurant.orders.some((order) => order.item.removedIngredients);

  const getOrdersQuantity = (orders: Order[]) =>
    orders.reduce((acc, curr) => acc + curr.item.quantity, 0);

  // Separate order for each restaurant
  useEffect(() => {
    if (!isLoading && router.isReady) {
      const ordersGroup = orderGroups.find(
        (ordersGroup) =>
          dateToMS(ordersGroup.deliveryDate).toString() === router.query.date &&
          ordersGroup.company._id === router.query.company
      );

      if (ordersGroup) {
        setOrdersByRestaurants(
          ordersGroup.restaurants.reduce((acc: OrdersByRestaurant[], curr) => {
            return [
              ...acc,
              {
                company: {
                  name: ordersGroup.company.name,
                  shift: ordersGroup.company.shift,
                },
                restaurantName: curr,
                deliveryDate: ordersGroup.deliveryDate,
                orders: ordersGroup.orders.filter(
                  (order) => order.restaurant.name === curr
                ),
              },
            ];
          }, [])
        );
      }
    }
  }, [router.isReady, isLoading, orderGroups]);

  // Get amounts
  useEffect(() => {
    if (!allUpcomingOrders.isLoading && !allDeliveredOrders.isLoading) {
      const filterConditions = (order: Order) =>
        dateToMS(order.delivery.date).toString() === router.query.date &&
        order.company._id === router.query.company;

      const allOrders = [
        ...allUpcomingOrders.data.filter((order) => filterConditions(order)),
        ...allDeliveredOrders.data.filter((order) => filterConditions(order)),
      ];

      setAmount({
        paid: allOrders
          .filter((order) => order.payment)
          .reduce((acc: Order[], curr) => {
            // Remove orders with duplicate payment intent
            if (
              !acc.some(
                (order) => order.payment?.intent === curr.payment?.intent
              )
            ) {
              return [...acc, curr];
            } else {
              return acc;
            }
          }, [])
          .reduce((acc, curr) => acc + (curr.payment?.amount as number), 0),
        total: allOrders.reduce((acc, curr) => acc + curr.item.total, 0),
      });
    }
  }, [allUpcomingOrders, allDeliveredOrders]);

  return (
    <section className={styles.orders_group_details}>
      {isLoading && <h2>Loading...</h2>}

      {!isLoading && ordersByRestaurants.length === 0 && (
        <h2>No orders found</h2>
      )}

      {ordersByRestaurants.length > 0 && (
        <>
          <h2>Order details - {date}</h2>
          <table>
            <thead>
              <tr>
                <th className={styles.hide_on_mobile}>Date</th>
                <th>Company</th>
                <th className={styles.hide_on_mobile}>Shift</th>
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
                  <td>{ordersByRestaurant.company.name}</td>
                  <td className={`${styles.shift} ${styles.hide_on_mobile}`}>
                    {ordersByRestaurant.company.shift}
                  </td>
                  <td>{ordersByRestaurant.restaurantName}</td>
                  <td className={styles.hide_on_mobile}>
                    {getOrdersQuantity(ordersByRestaurant.orders)}
                  </td>
                  <td>
                    {ordersByRestaurant.orders.every(
                      (order) => order.status === 'PROCESSING'
                    ) ? (
                      <span
                        className={styles.send_email}
                        onClick={() =>
                          initiateOrdersDelivery(
                            ordersByRestaurant.orders,
                            ordersByRestaurant.restaurantName
                          )
                        }
                      >
                        Deliver
                      </span>
                    ) : (
                      <span>Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ordersByRestaurants.map((ordersByRestaurant, index) => (
            <div key={index}>
              <h2>
                Order summary - {ordersByRestaurant.restaurantName} - {date}
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Dish</th>
                    {hasOptionalAddons(ordersByRestaurant) && (
                      <th className={styles.hide_on_mobile}>Optional addons</th>
                    )}

                    {hasRequiredAddons(ordersByRestaurant) && (
                      <th className={styles.hide_on_mobile}>Required addons</th>
                    )}

                    {hasRemovedIngredients(ordersByRestaurant) && (
                      <th className={styles.hide_on_mobile}>Removed</th>
                    )}

                    <th>Item price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {groupIdenticalOrdersForAdmin(ordersByRestaurant.orders).map(
                    (order, index) => (
                      <tr key={index}>
                        <td>{order.item.name}</td>

                        {hasOptionalAddons(ordersByRestaurant) && (
                          <td
                            className={`${styles.hide_on_mobile} ${styles.ingredients}`}
                          >
                            {order.item.optionalAddons}
                          </td>
                        )}

                        {hasRequiredAddons(ordersByRestaurant) && (
                          <td
                            className={`${styles.hide_on_mobile} ${styles.ingredients}`}
                          >
                            {order.item.requiredAddons}
                          </td>
                        )}

                        {hasRemovedIngredients(ordersByRestaurant) && (
                          <td
                            className={`${styles.hide_on_mobile} ${styles.ingredients}`}
                          >
                            {order.item.removedIngredients}
                          </td>
                        )}
                        <td>{numberToUSD(order.item.total)}</td>

                        <td>{order.item.quantity}</td>
                      </tr>
                    )
                  )}
                  <tr className={styles.total}>
                    <td>Total</td>
                    {hasOptionalAddons(ordersByRestaurant) && (
                      <td className={styles.hide_on_mobile}></td>
                    )}

                    {hasRequiredAddons(ordersByRestaurant) && (
                      <td className={styles.hide_on_mobile}></td>
                    )}

                    {hasRemovedIngredients(ordersByRestaurant) && (
                      <td className={styles.hide_on_mobile}></td>
                    )}
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

              <h2>
                Customer information - {ordersByRestaurant.restaurantName} -{' '}
                {date}
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className={styles.hide_on_mobile}>Email</th>
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
                      <td>{order.item.name}</td>
                      <td>
                        {order.status === 'PROCESSING' ? (
                          <span
                            className={styles.archive}
                            onClick={(e) => initiateStatusUpdate(order._id)}
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

          <h2>Charge information - {date}</h2>

          <table>
            <thead>
              <tr>
                <th>Reimbursed</th>
                <th>Paid</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{numberToUSD(amount.total - amount.paid)}</td>
                <td>{numberToUSD(amount.paid)}</td>
                <td>{numberToUSD(amount.total)}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Archive modal */}
      <ModalContainer
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
        component={
          <ActionModal
            name='this order'
            action='Archive'
            performAction={updateStatus}
            isPerformingAction={isUpdatingOrderStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />

      {/* Delivery modal */}
      <ModalContainer
        showModalContainer={showDeliveryModal}
        setShowModalContainer={setShowDeliveryModal}
        component={
          <ActionModal
            name='delivery emails'
            action='send'
            performAction={deliverOrders}
            isPerformingAction={isUpdatingOrdersStatus}
            setShowActionModal={setShowDeliveryModal}
          />
        }
      />
    </section>
  );
}
