import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useEffect, useState } from "react";
import { IOrdersByRestaurant, IOrdersGroupDetailsProps, IOrder } from "types";
import {
  axiosInstance,
  convertDateToMS,
  convertDateToText,
  createSlug,
  formatCurrencyToUSD,
} from "@utils/index";
import styles from "@styles/admin/OrdersGroupDetails.module.css";
import ButtonLoader from "@components/layout/ButtonLoader";

export default function OrdersGroupDetails({
  isLoading,
  ordersGroups,
}: IOrdersGroupDetailsProps) {
  // Hooks
  const router = useRouter();
  const [isUpdatingOrdersStatus, setIsUpdatingOrdersStatus] = useState(false);
  const { setAllUpcomingOrders, setAllDeliveredOrders } = useData();
  const [ordersByRestaurants, setOrdersByRestaurants] = useState<
    IOrdersByRestaurant[]
  >([]);

  // Separate order for each restaurant
  useEffect(() => {
    if (!isLoading && router.isReady) {
      // Find the orders group
      const ordersGroup = ordersGroups.find(
        (ordersGroup) =>
          convertDateToMS(ordersGroup.deliveryDate) === +router.query.date! &&
          createSlug(ordersGroup.companyName) === router.query.company
      );

      // Separate orders for each restaurant
      if (ordersGroup) {
        setOrdersByRestaurants(
          ordersGroup.restaurants.reduce((acc: IOrdersByRestaurant[], curr) => {
            return [
              ...acc,
              {
                restaurantName: curr,
                companyName: ordersGroup.companyName,
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

  // Send delivery email
  async function sendDeliveryEmail(orders: IOrder[], restaurantName: string) {
    // Get order ids
    const orderIds = orders.map((order) => order._id);

    // Update orders status
    try {
      setIsUpdatingOrdersStatus(true);
      // Show the loader

      // Make request to the backend
      await axiosInstance.put("/orders/status", {
        orderIds,
      });

      // Remove the restaurant
      setOrdersByRestaurants((currState) =>
        currState.filter(
          (ordersByRestaurant) =>
            ordersByRestaurant.restaurantName !== restaurantName
        )
      );

      // Remove the orders from the upcoming orders
      setAllUpcomingOrders((currState) => ({
        ...currState,
        data: orderIds
          .map((orderId) =>
            currState.data.filter((order) => order._id !== orderId)
          )
          .flat(2),
      }));

      // Add the orders to delivered orders
      setAllDeliveredOrders((currState) => ({
        ...currState,
        data: [...currState.data, ...orders],
      }));

      // Push to the dashboard when there are no restaurant
      ordersByRestaurants.length === 1 && router.push("/admin");
    } catch (err) {
      console.log(err);
    } finally {
      // Remove the loader
      setIsUpdatingOrdersStatus(false);
    }
  }

  // Archive order
  async function archiveOrder(orderId: string, ordersLength: number) {
    try {
      // Make request to the backend
      await axiosInstance.put(`/orders/${orderId}/status`);

      // Remove the order
      setAllUpcomingOrders((currState) => ({
        ...currState,
        data: currState.data.filter((order) => order._id !== orderId),
      }));

      // Push to the dashboard when there are no restaurant
      ordersLength === 1 && router.push("/admin");
    } catch (err) {
      // Log error
      console.log(err);
    }
  }

  return (
    <section className={styles.orders_group_details}>
      {isLoading && <h2>Loading...</h2>}

      {!isLoading && ordersByRestaurants.length === 0 && (
        <h2>No orders found</h2>
      )}

      {ordersByRestaurants.length > 0 && (
        <>
          <h2>Order details - {convertDateToText(+router.query.date!)}</h2>
          <table>
            <thead>
              <tr>
                <th className={styles.hide_on_mobile}>Date</th>
                <th>Company</th>
                <th>Restaurant</th>
                <th>Orders</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ordersByRestaurants.map((ordersByRestaurant, index) => (
                <tr key={index}>
                  <td className={styles.hide_on_mobile}>
                    {convertDateToText(ordersByRestaurant.deliveryDate)}
                  </td>
                  <td>{ordersByRestaurant.companyName}</td>
                  <td>{ordersByRestaurant.restaurantName}</td>
                  <td>{ordersByRestaurant.orders.length}</td>
                  <td>
                    {ordersByRestaurant.orders.every(
                      (order) => order.status === "PROCESSING"
                    ) ? (
                      <span
                        className={styles.send_email}
                        onClick={() =>
                          sendDeliveryEmail(
                            ordersByRestaurant.orders,
                            ordersByRestaurant.restaurantName
                          )
                        }
                      >
                        {isUpdatingOrdersStatus ? (
                          <ButtonLoader color="#f78f1e" size={7} />
                        ) : (
                          "Send delivery email"
                        )}
                      </span>
                    ) : (
                      <span>Delivery email sent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ordersByRestaurants.map((ordersByRestaurant, index) => (
            <div key={index}>
              <h2>
                Order summary - {ordersByRestaurant.restaurantName} -{" "}
                {convertDateToText(ordersByRestaurant.deliveryDate)}
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Dish</th>
                    <th>Item price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {ordersByRestaurant.orders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.item.name}</td>
                      <td>{formatCurrencyToUSD(order.item.total)}</td>
                      <td>{order.item.quantity}</td>
                    </tr>
                  ))}
                  <tr className={styles.total}>
                    <td>Total</td>
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
                {convertDateToText(ordersByRestaurant.deliveryDate)}
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
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
                      <td>{order.customer.email}</td>
                      <td>{order.item.name}</td>
                      <td>
                        {order.status === "PROCESSING" ? (
                          <span
                            className={styles.archive}
                            onClick={() =>
                              archiveOrder(
                                order._id,
                                ordersByRestaurant.orders.length
                              )
                            }
                          >
                            Archive
                          </span>
                        ) : (
                          <span>Order delivered</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
