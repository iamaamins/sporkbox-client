import OrderRow from "./OrderRow";
import { useState } from "react";
import { BiSort } from "react-icons/bi";
import FilterAndSort from "./FilterAndSort";
import { IOrder, IOrdersProps } from "types";
import styles from "@styles/admin/Orders.module.css";

export default function Orders({ title, orders }: IOrdersProps) {
  const [showController, setShowController] = useState<boolean>(false);
  const [filteredAndSortedOrders, setFilteredAndSortedOrders] = useState<
    IOrder[]
  >([]);

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
              onClick={() => setShowController(!showController)}
              className={styles.filter}
            >
              Filter <BiSort />
            </p>
          </div>

          {/* Filters */}
          <FilterAndSort
            orders={orders}
            showController={showController}
            setFilteredAndSortedOrders={setFilteredAndSortedOrders}
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
              {filteredAndSortedOrders.length === 0 ? (
                <>
                  {orders.map((order, index) => (
                    <OrderRow key={index} order={order} />
                  ))}
                </>
              ) : (
                <>
                  {filteredAndSortedOrders.map((order, index) => (
                    <OrderRow key={index} order={order} />
                  ))}
                </>
              )}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
