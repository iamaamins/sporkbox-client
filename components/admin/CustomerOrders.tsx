import styles from '@components/admin/Customer.module.css';
import { IdenticalOrderGroup } from 'types';
import { dateToText, numberToUSD } from '@lib/utils';

type Props = { orderGroups: IdenticalOrderGroup[] };

export default function CustomerOrders({ orderGroups }: Props) {
  return (
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
  );
}
