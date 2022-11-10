import Orders from "./Orders";
import { useState } from "react";
import { useUser } from "@context/User";
import { useData } from "@context/Data";
import styles from "@styles/generic/Dashboard.module.css";
import ActionButton from "@components/layout/ActionButton";
import { axiosInstance, formatCurrencyToUSD } from "@utils/index";

export default function Dashboard() {
  // Hooks
  const { user } = useUser();
  const {
    setCustomerDeliveredOrders,
    isCustomerActiveOrdersLoading,
    isCustomerDeliveredOrdersLoading,
  } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const { customerActiveOrders, customerDeliveredOrders } = useData();

  // Handle load all delivered orders
  async function handleLoadAllDeliveredOrders() {
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.get(`/orders/me/delivered/0`);

      // Update state
      setCustomerDeliveredOrders(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  // // Remove this
  // const customerActiveOrders = [
  //   {
  //     item: {
  //       _id: "63584946975728c6e773526f",
  //       name: "Sporks",
  //       quantity: 1,
  //       total: 15,
  //     },
  //     hasReviewed: false,
  //     _id: "6366856dbef4fcd70e26a783",
  //     restaurantId: "6358491f975728c6e7735267",
  //     restaurantName: "Sporkology",
  //     deliveryDate: "2022-11-14T00:00:00.000Z",
  //     status: "PROCESSING",
  //     createdAt: "2022-11-05T15:46:53.391Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f5ef8d1c13fee32cf13",
  //       name: "Chinese Beef Stew",
  //       quantity: 7,
  //       total: 139.93,
  //     },
  //     hasReviewed: false,
  //     _id: "636723be20ab9cbc14b6a90b",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-14T00:00:00.000Z",
  //     status: "PROCESSING",
  //     createdAt: "2022-11-06T03:02:22.435Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f97f8d1c13fee32cf1f",
  //       name: "Mapo Tofu",
  //       quantity: 1,
  //       total: 4.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6367230320ab9cbc14b6a8ed",
  //     restaurantId: "63478db2f8d1c13fee32cece",
  //     restaurantName: "4Cheeze",
  //     deliveryDate: "2022-11-15T00:00:00.000Z",
  //     status: "PROCESSING",
  //     createdAt: "2022-11-06T02:59:15.922Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478fb3f8d1c13fee32cf24",
  //       name: "Egg tarts",
  //       quantity: 1,
  //       total: 3.99,
  //     },
  //     hasReviewed: false,
  //     _id: "63675318ddc88701c327dcf1",
  //     restaurantId: "63478db2f8d1c13fee32cece",
  //     restaurantName: "4Cheeze",
  //     deliveryDate: "2022-11-15T00:00:00.000Z",
  //     status: "PROCESSING",
  //     createdAt: "2022-11-06T06:24:24.062Z",
  //   },
  //   {
  //     item: {
  //       _id: "6350f3f9826e570948787690",
  //       name: "Sui mai",
  //       quantity: 1,
  //       total: 4.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6369c52fd2d068eb966d40f1",
  //     restaurantId: "6350a9e1cde0487ab53d451e",
  //     restaurantName: "Raj Mahal",
  //     deliveryDate: "2022-11-16T00:00:00.000Z",
  //     status: "PROCESSING",
  //     createdAt: "2022-11-08T02:55:43.167Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f82f8d1c13fee32cf1b",
  //       name: "Congee",
  //       quantity: 1,
  //       total: 4.99,
  //     },
  //     hasReviewed: false,
  //     _id: "63677ee2f1d4eba93cd85e09",
  //     restaurantId: "63478db2f8d1c13fee32cece",
  //     restaurantName: "4Cheeze",
  //     deliveryDate: "2022-11-18T00:00:00.000Z",
  //     status: "PROCESSING",
  //     createdAt: "2022-11-06T09:31:14.390Z",
  //   },
  // ];

  // // Remove this
  // const customerDeliveredOrders = [
  //   {
  //     item: {
  //       _id: "63584946975728c6e773526f",
  //       name: "Sporks",
  //       quantity: 1,
  //       total: 15,
  //     },
  //     _id: "63668011f2f9075c1783ee49",
  //     restaurantId: "6358491f975728c6e7735267",
  //     restaurantName: "Sporkology",
  //     deliveryDate: "2022-11-14T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-05T15:24:01.186Z",
  //     hasReviewed: true,
  //   },
  //   {
  //     item: {
  //       _id: "63478f40f8d1c13fee32cf0e",
  //       name: "Sichuan Prawn stir fry",
  //       quantity: 1,
  //       total: 24.99,
  //     },
  //     _id: "6366852fbef4fcd70e26a741",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-14T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-05T15:45:51.857Z",
  //     hasReviewed: true,
  //   },
  //   {
  //     item: {
  //       _id: "63478f1ef8d1c13fee32cf0a",
  //       name: "Chicken Katsu curry",
  //       quantity: 1,
  //       total: 17.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6366852fbef4fcd70e26a740",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-14T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-05T15:45:51.857Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f40f8d1c13fee32cf0e",
  //       name: "Sichuan Prawn stir fry",
  //       quantity: 2,
  //       total: 49.98,
  //     },
  //     hasReviewed: false,
  //     _id: "63617ba5f4449b7902b5fcf0",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-01T20:03:49.307Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f1ef8d1c13fee32cf0a",
  //       name: "Chicken Katsu curry",
  //       quantity: 1,
  //       total: 17.99,
  //     },
  //     hasReviewed: false,
  //     _id: "63620eb89736a8eb3baaf78d",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-02T06:31:20.852Z",
  //   },
  //   {
  //     item: {
  //       _id: "634869f68193b7fd7345b436",
  //       name: "Tofu Pad Kee Mao",
  //       quantity: 4,
  //       total: 60,
  //     },
  //     hasReviewed: false,
  //     _id: "63617c05f4449b7902b5fd1a",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-01T20:05:25.728Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f40f8d1c13fee32cf0e",
  //       name: "Sichuan Prawn stir fry",
  //       quantity: 1,
  //       total: 24.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6361cf6728a321ab5d92a82d",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-02T02:01:11.463Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f40f8d1c13fee32cf0e",
  //       name: "Sichuan Prawn stir fry",
  //       quantity: 1,
  //       total: 24.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6360de1fdcc55c922a11fa1f",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-01T08:51:43.356Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f5ef8d1c13fee32cf13",
  //       name: "Chinese Beef Stew",
  //       quantity: 1,
  //       total: 19.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6360df04346f143232bcb639",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-01T08:55:32.644Z",
  //   },
  //   {
  //     item: {
  //       _id: "63478f1ef8d1c13fee32cf0a",
  //       name: "Chicken Katsu curry",
  //       quantity: 1,
  //       total: 17.99,
  //     },
  //     hasReviewed: false,
  //     _id: "6360dd98dcc55c922a11f968",
  //     restaurantId: "63478e5af8d1c13fee32cee6",
  //     restaurantName: "Tasty Land",
  //     deliveryDate: "2022-11-07T00:00:00.000Z",
  //     status: "DELIVERED",
  //     createdAt: "2022-11-01T08:49:28.143Z",
  //   },
  // ];

  return (
    <section className={styles.dashboard}>
      {user && (
        <>
          <div className={styles.details}>
            <h2>Welcome {user.name}</h2>
            <p>
              Daily budget:{" "}
              <span>{formatCurrencyToUSD(user.company?.dailyBudget!)}</span>
            </p>
            <p>
              Company: <span>{user.company?.name}</span>
            </p>
            <p>
              Address: <span>{user.company?.address}</span>
            </p>
          </div>

          {isCustomerActiveOrdersLoading && <h2>Loading...</h2>}

          {/* Active orders */}
          {customerActiveOrders.length > 0 && (
            <div className={styles.active_orders}>
              <h2>Active orders</h2>
              <Orders orders={customerActiveOrders} />
            </div>
          )}

          {isCustomerDeliveredOrdersLoading && <h2>Loading...</h2>}

          {/* Delivered orders */}
          {customerDeliveredOrders.length > 0 && (
            <div className={styles.delivered_orders}>
              <h2>Delivered orders</h2>

              <Orders orders={customerDeliveredOrders} />

              {customerDeliveredOrders.length === 10 && (
                <span className={styles.load_all}>
                  <ActionButton
                    buttonText="Load all orders"
                    isLoading={isLoading}
                    handleClick={handleLoadAllDeliveredOrders}
                  />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
