import Order from "./Order";
import Filters from "./Filters";
import { useState } from "react";
import { useData } from "@context/Data";
import { BsFilter } from "react-icons/bs";
import { IOrder, IOrdersProps } from "types";
import styles from "@styles/admin/Orders.module.css";

export default function Orders({ title, orders }: IOrdersProps) {
  const { activeOrders } = useData();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  return (
    <section className={styles.orders}>
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
            <th>Order#</th>
            <th className={styles.hide_on_mobile}>Created on</th>
            <th className={styles.hide_on_mobile}>Restaurant</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length === 0 ? (
            <>
              {activeOrders.map((order, index) => (
                <Order key={index} order={order} />
              ))}
            </>
          ) : (
            <>
              {filteredOrders.map((order, index) => (
                <Order key={index} order={order} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </section>
  );
}
