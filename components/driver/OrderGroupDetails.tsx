import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import ActionModal from '../admin/layout/ActionModal';
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
  createOrderGroups,
} from '@lib/utils';
import styles from './OrderGroupDetails.module.css';
import ModalContainer from '@components/layout/ModalContainer';

type OrderDeliveryPayload = { orders: Order[]; restaurantName: string };

export default function OrderGroupDetails() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { driverOrders, setDriverOrders } = useData();
  const [isDeliveringOrders, setIsDeliveringOrders] = useState(false);
  const [ordersByRestaurants, setOrdersByRestaurants] = useState<
    OrdersByRestaurant[]
  >([]);
  const [orderDeliveryPayload, setOrderDeliveryPayload] =
    useState<OrderDeliveryPayload>({
      orders: [],
      restaurantName: '',
    });
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const orderGroups = createOrderGroups(driverOrders.data);
  const date = dateToText(+(router.query.date as string));

  const getOrdersQuantity = (orders: Order[]) =>
    orders.reduce((acc, curr) => acc + curr.item.quantity, 0);

  function initiateOrdersDelivery(orders: Order[], restaurantName: string) {
    setShowDeliveryModal(true);
    setOrderDeliveryPayload({ orders, restaurantName });
  }

  async function deliverOrders() {
    const orderIds = orderDeliveryPayload.orders.map((order) => order._id);

    try {
      setIsDeliveringOrders(true);

      await axiosInstance.patch('/orders/deliver', {
        action: 'deliver',
        orderIds,
      });

      setOrdersByRestaurants((prevState) =>
        prevState.filter(
          (ordersByRestaurant) =>
            ordersByRestaurant.restaurantName !==
            orderDeliveryPayload.restaurantName
        )
      );

      setDriverOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter((order) => !orderIds.includes(order._id)),
      }));

      showSuccessAlert('Orders delivered', setAlerts);
      ordersByRestaurants.length === 1 && router.push('/driver');
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsDeliveringOrders(false);
      setShowDeliveryModal(false);
    }
  }

  // Separate orders for each restaurant
  useEffect(() => {
    if (router.isReady && orderGroups.length > 0) {
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
  }, [router.isReady, orderGroups]);

  return (
    <section className={styles.container}>
      <h2>
        {driverOrders.isLoading
          ? 'Loading...'
          : !driverOrders.isLoading &&
            ordersByRestaurants.length === 0 &&
            'No orders found'}
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
                        <td className={styles.hide_on_mobile}>
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
                      <td className={styles.hide_on_mobile}>
                        {order.company.shift}
                      </td>
                      <td>{order.item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
      <ModalContainer
        showModalContainer={showDeliveryModal}
        setShowModalContainer={setShowDeliveryModal}
        component={
          <ActionModal
            name='delivery emails'
            action='send'
            performAction={deliverOrders}
            isPerformingAction={isDeliveringOrders}
            setShowActionModal={setShowDeliveryModal}
          />
        }
      />
    </section>
  );
}
