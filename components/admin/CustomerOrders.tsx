import { IdenticalOrderGroup } from 'types';
import styles from '@components/customer/CustomerOrders.module.css';
import { dateToText, numberToUSD } from '@lib/utils';

type Props = { orderGroups: IdenticalOrderGroup[]; orderStatus: string };

export default function CustomerOrders({ orderGroups, orderStatus }: Props) {
  return (
    <>
      <h2>{orderStatus} orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th className={styles.hide_on_mobile}>Optional addons</th>
            <th className={styles.hide_on_mobile}>Required addons</th>
            <th className={styles.hide_on_mobile}>Removed</th>
            <th>Quantity</th>
            <th className={styles.hide_on_mobile}>Restaurant</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderGroups.map((group, index) => (
            <tr key={index}>
              <td>{dateToText(group.delivery.date)}</td>
              <td>{group.item.name}</td>
              <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                {group.item.optionalAddons}
              </td>
              <td className={`${styles.hide_on_mobile} ${styles.addons}`}>
                {group.item.requiredAddons}
              </td>
              <td
                className={`${styles.hide_on_mobile} ${styles.removed_ingredients}`}
              >
                {group.item.removedIngredients}
              </td>
              <td>{group.item.quantity}</td>
              <td className={styles.hide_on_mobile}>{group.restaurant.name}</td>
              <td>{numberToUSD(group.item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
