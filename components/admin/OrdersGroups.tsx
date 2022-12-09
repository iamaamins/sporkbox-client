import OrdersGroupRow from "./OrdersGroupRow";
import { useState } from "react";
import { useData } from "@context/Data";
import { BiSort } from "react-icons/bi";
import { useRouter } from "next/router";
import FilterAndSort from "./FilterAndSort";
import { axiosInstance } from "@utils/index";
import { IOrder, IOrdersGroupsProps } from "types";
import styles from "@styles/admin/OrdersGroups.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function OrdersGroups({
  title,
  ordersGroups,
}: IOrdersGroupsProps) {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { allActiveOrders, allDeliveredOrders, setAllDeliveredOrders } =
    useData();
  const [showController, setShowController] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

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
      {(allActiveOrders.isLoading || allDeliveredOrders.isLoading) && (
        <h2>Loading...</h2>
      )}

      {/* If there are no orders groups */}
      {!allActiveOrders.isLoading &&
        !allDeliveredOrders.isLoading &&
        ordersGroups.length === 0 && <h2>No {title.toLowerCase()}</h2>}

      {/* If there are active orders */}
      {ordersGroups.length > 0 && (
        <>
          {/* Title and filter icon */}
          <div className={styles.orders_top}>
            <h2>{title}</h2>

            <p
              className={`${styles.filter} ${
                showController && styles.show_controller
              }`}
              onClick={() => setShowController(!showController)}
            >
              Filter <BiSort />
            </p>
          </div>

          {/* Filters */}
          {/* <FilterAndSort
            orders={ordersGroups}
            showController={showController}
            setFilteredOrders={setFilteredOrders}
          /> */}

          {/* Orders */}
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
              {/* {filteredOrders.length === 0 ? (
                <>
                  {ordersGroups.map((ordersGroup, index) => (
                    <OrderRow key={index} ordersGroup={ordersGroup} />
                  ))}
                </>
              ) : (
                <>
                  {filteredOrders.map((order, index) => (
                    <OrderRow key={index} ordersGroup={order} />
                  ))}
                </>
              )} */}

              {ordersGroups.map((ordersGroup, index) => (
                <OrdersGroupRow key={index} ordersGroup={ordersGroup} />
              ))}
            </tbody>
          </table>

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
