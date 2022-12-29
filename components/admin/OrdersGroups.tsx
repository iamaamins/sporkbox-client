import { useState } from "react";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import { axiosInstance } from "@utils/index";
import OrdersGroupRow from "./OrdersGroupRow";
import SortOrdersGroups from "./SortOrdersGroups";
import { IOrdersGroupsProps, ISorted } from "types";
import styles from "@styles/admin/OrdersGroups.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function OrdersGroups({
  slug,
  title,
  ordersGroups,
}: IOrdersGroupsProps) {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { allUpcomingOrders, allDeliveredOrders, setAllDeliveredOrders } =
    useData();
  const [sorted, setSorted] = useState<ISorted>({
    byCompany: false,
    byDeliveryDate: false,
  });

  async function handleLoadAllDeliveredOrders() {
    // Get all delivered orders
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.get(`/orders/delivered/0`);

      // Update state
      setAllDeliveredOrders(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.orders_groups}>
      {(allUpcomingOrders.isLoading || allDeliveredOrders.isLoading) && (
        <h2>Loading...</h2>
      )}

      {/* If there are no orders groups */}
      {!allUpcomingOrders.isLoading &&
        !allDeliveredOrders.isLoading &&
        ordersGroups.length === 0 && <h2>No {title.toLowerCase()}</h2>}

      {/* If there are active orders */}
      {ordersGroups.length > 0 && (
        <>
          {/* Title and filter icon */}
          <div className={styles.orders_top}>
            <h2>{title}</h2>

            {/* Sort orders groups by company and delivery date */}
            <SortOrdersGroups
              setSorted={setSorted}
              ordersGroups={ordersGroups}
            />
          </div>

          {/* Orders groups */}
          <table>
            <thead>
              <tr>
                <th>Delivery date</th>
                <th className={styles.hide_on_mobile}>Company</th>
                <th className={styles.hide_on_mobile}>Restaurant</th>
                <th>Orders</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ordersGroups.map((ordersGroup, index) => (
                <OrdersGroupRow
                  key={index}
                  slug={slug}
                  ordersGroup={ordersGroup}
                />
              ))}
            </tbody>
          </table>

          {/* Load all orders button */}
          {router.pathname === "/admin/orders" &&
            ordersGroups.length === 25 && (
              <span className={styles.load_all}>
                <ActionButton
                  buttonText="Load all orders"
                  isLoading={isLoading}
                  handleClick={handleLoadAllDeliveredOrders}
                />
              </span>
            )}
        </>
      )}
    </section>
  );
}
