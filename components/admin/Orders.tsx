import OrderRow from "./OrderRow";
import { useState } from "react";
import { BiSort } from "react-icons/bi";
import { useRouter } from "next/router";
import FilterAndSort from "./FilterAndSort";
import { IOrder, IOrdersProps } from "types";
import styles from "@styles/admin/Orders.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function Orders({ title, orders }: IOrdersProps) {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showController, setShowController] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  async function handleLoadAll() {}

  return (
    <section className={styles.orders}>
      {/* If there are no active orders */}
      {orders.length === 0 && <h2>No {title.toLowerCase()}</h2>}
      {/* If there are active orders */}
      {orders.length > 0 && (
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
          <FilterAndSort
            orders={orders}
            showController={showController}
            setFilteredOrders={setFilteredOrders}
          />

          {/* Orders */}
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th className={styles.hide_on_mobile}>Company</th>
                <th className={styles.hide_on_mobile}>Restaurant</th>
                <th>Delivery date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <>
                  {orders.map((order, index) => (
                    <OrderRow key={index} order={order} />
                  ))}
                </>
              ) : (
                <>
                  {filteredOrders.map((order, index) => (
                    <OrderRow key={index} order={order} />
                  ))}
                </>
              )}
            </tbody>
          </table>

          {router.pathname === "/admin/orders" && orders.length === 50 && (
            <span className={styles.load_all}>
              <ActionButton
                buttonText="Load all"
                handleClick={handleLoadAll}
                isLoading={isLoading}
              />
            </span>
          )}
        </>
      )}
    </section>
  );
}
