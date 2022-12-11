import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IOrdersByRestaurant, IOrdersGroupDetailsProps } from "types";
import { convertDateToMS, convertDateToText, textToSlug } from "@utils/index";
import styles from "@styles/admin/OrdersGroupDetails.module.css";

export default function OrdersGroupDetails({
  isLoading,
  ordersGroups,
}: IOrdersGroupDetailsProps) {
  // Hooks
  const router = useRouter();
  const [ordersByRestaurants, setOrdersByRestaurants] = useState<
    IOrdersByRestaurant[]
  >([]);

  // Separate order for each restaurant
  useEffect(() => {
    if (router.isReady && !isLoading) {
      // Find the orders group
      const ordersGroup = ordersGroups.find(
        (ordersGroup) =>
          convertDateToMS(ordersGroup.deliveryDate) === +router.query.date! &&
          textToSlug(ordersGroup.companyName) === router.query.company
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
                  (order) => order.restaurantName === curr
                ),
              },
            ];
          }, [])
        );
      }
    }
  }, [router.isReady, isLoading]);

  return (
    <section className={styles.orders_group_details}>
      {isLoading && <h2>Loading...</h2>}

      {!isLoading && ordersByRestaurants.length === 0 && (
        <h2>No orders found</h2>
      )}

      {ordersByRestaurants.length > 0 && (
        <div>
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
                    {ordersByRestaurant.deliveryDate}
                  </td>
                  <td>{ordersByRestaurant.companyName}</td>
                  <td>{ordersByRestaurant.restaurantName}</td>
                  <td>{ordersByRestaurant.orders.length}</td>
                  <td>Email</td>
                </tr>
              ))}
            </tbody>
          </table>

          {ordersByRestaurants.map((ordersByRestaurant, index) => (
            <div key={index}>
              <h2>
                Order summary - {ordersByRestaurant.restaurantName} -{" "}
                {ordersByRestaurant.deliveryDate}
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
                      <td>{order.item.total}</td>
                      <td>{order.item.quantity}</td>
                    </tr>
                  ))}
                  <tr className={styles.total}>
                    <td>Total</td>
                    <td>
                      {ordersByRestaurant.orders.reduce(
                        (acc, curr) => acc + curr.item.total,
                        0
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
                {ordersByRestaurant.deliveryDate}
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Dish</th>
                  </tr>
                </thead>

                <tbody>
                  {ordersByRestaurant.orders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.customerName}</td>
                      <td>{order.customerEmail}</td>
                      <td>{order.item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
