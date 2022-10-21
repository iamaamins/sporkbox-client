import axios from "axios";
import Link from "next/link";
import { IOrder } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useEffect, useState } from "react";
import styles from "@styles/admin/Order.module.css";
import ActionButton from "@components/layout/ActionButton";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

export default function Order() {
  const router = useRouter();
  const [order, setOrder] = useState<IOrder>();
  const [isLoading, setIsLoading] = useState(false);
  const { allOrders, setAllActiveOrders, setDeliveredOrders } = useData();

  // Get the order
  useEffect(() => {
    if (allOrders.length > 0 && router.isReady) {
      setOrder(
        allOrders.find((activeOrder) => activeOrder._id === router.query.order)
      );
    }
  }, [allOrders, router.isReady]);

  // Handle order status
  async function handleOrderStatus() {
    try {
      // Show the loader
      setIsLoading(true);

      // Make request to backend
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order?._id}/status`,
        {},
        { withCredentials: true }
      );

      // Update active orders
      setAllActiveOrders((currActiveOrders: IOrder[]) =>
        currActiveOrders.filter(
          (currActiveOrder) => currActiveOrder._id !== order?._id
        )
      );

      // Update delivered orders
      setDeliveredOrders((currDeliveredOrders: IOrder[]) => [
        ...currDeliveredOrders,
        res.data,
      ]);

      // Remove the loader
      setIsLoading(false);

      // Back to admin page
      router.back();
    } catch (err) {
      // Remove the loader
      setIsLoading(false);
      console.log(err);
    }
  }

  return (
    <section className={styles.order}>
      {!order && <h2>No order found</h2>}

      {/* If order exists */}
      {order && (
        <>
          <h2 className={styles.order_title}>Order details</h2>

          <>
            <p className={styles.title}>General</p>
            <table>
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Created on</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.important}>
                    <Link href={`/admin/restaurants/${order.restaurantId}`}>
                      <a>{order.restaurantName}</a>
                    </Link>
                  </td>
                  <td>{convertDateToText(order.createdAt)}</td>
                  <td>{order.status.toLowerCase()}</td>
                </tr>
              </tbody>
            </table>
          </>

          <>
            <p className={styles.title}>Customer</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.companyName}</td>
                </tr>
              </tbody>
            </table>
          </>

          <>
            <p className={styles.title}>Delivery details</p>
            <table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.deliveryAddress}</td>
                  <td>{order.deliveryDate}</td>
                </tr>
              </tbody>
            </table>
          </>

          <>
            <p className={styles.title}>Item</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.important}>
                    <Link
                      href={`/admin/restaurants/${order.restaurantId}/${order.item._id}`}
                    >
                      <a>{order.item.name}</a>
                    </Link>
                  </td>
                  <td>{order.item.quantity}</td>
                  <td>{formatCurrencyToUSD(order.item.total)}</td>
                </tr>
              </tbody>
            </table>
          </>

          {order.status === "PROCESSING" && (
            <ActionButton
              isLoading={isLoading}
              buttonText="Mark as delivered"
              handleClick={handleOrderStatus}
            />
          )}
        </>
      )}
    </section>
  );
}
