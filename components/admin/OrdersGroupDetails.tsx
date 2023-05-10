import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import ActionModal from "./ActionModal";
import { useAlert } from "@context/Alert";
import { useEffect, useState } from "react";
import {
  IOrder,
  IAxiosError,
  IOrdersByRestaurant,
  IDeliverOrdersPayload,
  IOrdersGroupDetailsProps,
} from "types";
import {
  axiosInstance,
  convertDateToMS,
  showErrorAlert,
  showSuccessAlert,
  convertDateToText,
  formatCurrencyToUSD,
  groupIdenticalOrders,
} from "@utils/index";
import styles from "@styles/admin/OrdersGroupDetails.module.css";
import ModalContainer from "@components/layout/ModalContainer";

export default function OrdersGroupDetails({
  isLoading,
  ordersGroups,
}: IOrdersGroupDetailsProps) {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [orderId, setOrderId] = useState("");
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
    IOrdersByRestaurant[]
  >([]);
  const [statusUpdatePayload, setStatusUpdatePayload] =
    useState<IDeliverOrdersPayload>({
      orders: [],
      restaurantName: "",
    });
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState(false);

  // Separate order for each restaurant
  useEffect(() => {
    if (!isLoading && router.isReady) {
      // Find the orders group
      const ordersGroup = ordersGroups.find(
        (ordersGroup) =>
          convertDateToMS(ordersGroup.deliveryDate).toString() ===
            router.query.date &&
          ordersGroup.company._id === router.query.company
      );

      // Separate orders for each restaurant
      if (ordersGroup) {
        setOrdersByRestaurants(
          ordersGroup.restaurants.reduce((acc: IOrdersByRestaurant[], curr) => {
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
  }, [router.isReady, isLoading, ordersGroups]);

  // Get amounts
  useEffect(() => {
    if (!allUpcomingOrders.isLoading && !allDeliveredOrders.isLoading) {
      // Filter condition
      const filterConditions = (order: IOrder) =>
        convertDateToMS(order.delivery.date).toString() === router.query.date &&
        order.company._id === router.query.company;

      // Update state
      const allOrders = [
        ...allUpcomingOrders.data.filter((order) => filterConditions(order)),
        ...allDeliveredOrders.data.filter((order) => filterConditions(order)),
      ];

      // Update state
      setAmount({
        paid: allOrders
          .filter((order) => order.payment)
          .reduce((acc: IOrder[], curr) => {
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

  // Initiate orders delivery
  function initiateOrdersDelivery(orders: IOrder[], restaurantName: string) {
    // Update states
    setShowDeliveryModal(true);
    setStatusUpdatePayload({
      orders,
      restaurantName,
    });
  }

  // Delivery orders and send emails
  async function deliverOrders() {
    // Get order ids
    const orderIds = statusUpdatePayload.orders.map((order) => order._id);

    try {
      // Show the loader
      setIsUpdatingOrdersStatus(true);

      // Make request to the backend
      await axiosInstance.patch("/orders/change-orders-status", {
        orderIds,
      });

      // Remove the restaurant
      setOrdersByRestaurants((currState) =>
        currState.filter(
          (ordersByRestaurant) =>
            ordersByRestaurant.restaurantName !==
            statusUpdatePayload.restaurantName
        )
      );

      // Remove the orders from the upcoming orders
      setAllUpcomingOrders((currState) => ({
        ...currState,
        data: currState.data.filter((order) => !orderIds.includes(order._id)),
      }));

      // Add the orders to delivered orders
      setAllDeliveredOrders((currState) => ({
        ...currState,
        data: [
          ...currState.data,
          ...statusUpdatePayload.orders.map((order) => ({
            ...order,
            status: "DELIVERED",
          })),
        ],
      }));

      // Show success alert
      showSuccessAlert("Orders delivered", setAlerts);

      // Push to the dashboard when there are no restaurant
      ordersByRestaurants.length === 1 && router.push("/admin");
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader and close modal
      setIsUpdatingOrdersStatus(false);
      setShowDeliveryModal(false);
    }
  }

  // Initiate order status update
  function initiateStatusUpdate(orderId: string) {
    // Update states
    setShowStatusUpdateModal(true);
    setOrderId(orderId);
  }

  // Archive order
  async function updateStatus() {
    try {
      // Show loader
      setIsUpdatingOrderStatus(true);

      // Make request to the backend
      await axiosInstance.patch(`/orders/${orderId}/change-order-status`);

      // Remove the order
      setAllUpcomingOrders((currState) => ({
        ...currState,
        data: currState.data.filter((order) => order._id !== orderId),
      }));

      // Show success alert
      showSuccessAlert("Order archived", setAlerts);

      // Push to the admin page
      ordersByRestaurants
        .map((ordersByRestaurant) => ordersByRestaurant.orders)
        .flat().length === 1 && router.push("/admin");
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader and close modal
      setIsUpdatingOrderStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  // Get date in text
  const date = convertDateToText(+(router.query.date as string));

  // Check optional addons
  const hasOptionalAddons = (ordersByRestaurant: IOrdersByRestaurant) =>
    ordersByRestaurant.orders.some((order) => order.item.optionalAddons);

  // Check required addons
  const hasRequiredAddons = (ordersByRestaurant: IOrdersByRestaurant) =>
    ordersByRestaurant.orders.some((order) => order.item.requiredAddons);

  // // Check added ingredients
  // const hasAddedIngredients = (ordersByRestaurant: IOrdersByRestaurant) =>
  //   ordersByRestaurant.orders.some((order) => order.item.addedIngredients);

  // Check removed ingredients
  const hasRemovedIngredients = (ordersByRestaurant: IOrdersByRestaurant) =>
    ordersByRestaurant.orders.some((order) => order.item.removedIngredients);

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
                <th className={styles.hide_on_mobile}>Orders</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ordersByRestaurants.map((ordersByRestaurant, index) => (
                <tr key={index}>
                  <td className={styles.hide_on_mobile}>
                    {convertDateToText(ordersByRestaurant.deliveryDate)}
                  </td>
                  <td>{ordersByRestaurant.company.name}</td>
                  <td className={`${styles.shift} ${styles.hide_on_mobile}`}>
                    {ordersByRestaurant.company.shift}
                  </td>
                  <td>{ordersByRestaurant.restaurantName}</td>
                  <td className={styles.hide_on_mobile}>
                    {ordersByRestaurant.orders.length}
                  </td>
                  <td>
                    {ordersByRestaurant.orders.every(
                      (order) => order.status === "PROCESSING"
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
                  {groupIdenticalOrders(ordersByRestaurant.orders).map(
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
                        <td>{formatCurrencyToUSD(order.item.total)}</td>

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
                      {formatCurrencyToUSD(
                        ordersByRestaurant.orders.reduce(
                          (acc, curr) => acc + curr.item.total,
                          0
                        )
                      )}
                    </td>
                    <td>
                      {ordersByRestaurant.orders.reduce(
                        (acc, curr) => acc + curr.item.quantity,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>
                Customer information - {ordersByRestaurant.restaurantName} -{" "}
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
                        {order.status === "PROCESSING" ? (
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
                <td>{formatCurrencyToUSD(amount.total - amount.paid)}</td>
                <td>{formatCurrencyToUSD(amount.paid)}</td>
                <td>{formatCurrencyToUSD(amount.total)}</td>
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
            name="this order"
            action="Archive"
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
            name="delivery emails"
            action="send"
            performAction={deliverOrders}
            isPerformingAction={isUpdatingOrdersStatus}
            setShowActionModal={setShowDeliveryModal}
          />
        }
      />
    </section>
  );
}
