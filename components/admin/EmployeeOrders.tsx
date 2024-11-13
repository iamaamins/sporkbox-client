import { Order } from 'types';
import styles from '@components/admin/Employee.module.css';
import { dateToText, numberToUSD } from '@lib/utils';

type Props = { orders: Order[] };

export default function EmployeeOrders({ orders }: Props) {
  const hasOptionalAddons = orders.some((order) => order.item.optionalAddons);
  const hasRequiredAddons = orders.some((order) => order.item.requiredAddons);
  const hasRemovedIngredients = orders.some(
    (order) => order.item.removedIngredients
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Item</th>
          {hasOptionalAddons && (
            <th className={styles.hide_on_mobile}>Optional addons</th>
          )}
          {hasRequiredAddons && (
            <th className={styles.hide_on_mobile}>Required addons</th>
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
            <td>{dateToText(order.delivery.date)}</td>
            <td>{order.item.name}</td>
            {hasOptionalAddons && (
              <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                {order.item.optionalAddons}
              </td>
            )}

            {hasRequiredAddons && (
              <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                {order.item.requiredAddons}
              </td>
            )}

            {hasRemovedIngredients && (
              <td
                className={`${styles.hide_on_mobile} ${styles.removed_ingredients}`}
              >
                {order.item.removedIngredients}
              </td>
            )}
            <td>{order.item.quantity}</td>
            <td className={styles.hide_on_mobile}>{order.restaurant.name}</td>
            <td>{numberToUSD(order.item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
