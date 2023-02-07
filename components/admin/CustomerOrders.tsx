import { ICustomerOrdersProps } from "types";
import styles from "@styles/generic/CustomerOrders.module.css";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

export default function CustomerOrders({
  orders,
  orderStatus,
}: ICustomerOrdersProps) {
  // Check added ingredients
  const hasAddedIngredients = orders.some(
    (order) => order.item.addedIngredients
  );

  // Check removed ingredients
  const hasRemovedIngredients = orders.some(
    (order) => order.item.removedIngredients
  );
  return (
    <>
      <h2>{orderStatus} orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            {hasAddedIngredients && (
              <th className={styles.hide_on_mobile}>Added</th>
            )}
            {hasRemovedIngredients && (
              <th className={styles.hide_on_mobile}>Removed</th>
            )}

            <th>Quantity</th>
            <th className={styles.hide_on_mobile}>Restaurant</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{convertDateToText(order.delivery.date)}</td>
              <td>{order.item.name}</td>
              {hasAddedIngredients && (
                <td
                  className={`${styles.hide_on_mobile} ${styles.ingredients}`}
                >
                  {order.item.addedIngredients}
                </td>
              )}
              {hasRemovedIngredients && (
                <td
                  className={`${styles.hide_on_mobile} ${styles.ingredients}`}
                >
                  {order.item.removedIngredients}
                </td>
              )}
              <td>{order.item.quantity}</td>
              <td className={styles.hide_on_mobile}>{order.restaurant.name}</td>
              <td>{formatCurrencyToUSD(order.item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
