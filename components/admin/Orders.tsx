import OrderRow from "./OrderRow";
import Filters from "./Filters";
import { useState } from "react";
import { useData } from "@context/Data";
import { BsFilter } from "react-icons/bs";
import { IOrder, IOrdersProps } from "types";
import styles from "@styles/admin/Orders.module.css";

export default function Orders({ title, orders }: IOrdersProps) {
  // const { activeOrders } = useData();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

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
            <div
              className={styles.filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              <BsFilter />
            </div>
          </div>

          {/* Filters */}
          <Filters
            orders={orders}
            showFilters={showFilters}
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
        </>
      )}
    </section>
  );
}
