import { useUser } from "@context/User";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";
import styles from "@styles/generic/Dashboard.module.css";
import { useData } from "@context/Data";
import OrderRow from "@components/admin/OrderRow";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();
  const { customerActiveOrders } = useData();

  return (
    <section className={styles.dashboard}>
      {user && (
        <>
          <div className={styles.details}>
            <h2>Welcome {user.name}</h2>
            <p>
              Weekly budget:{" "}
              <span>{formatCurrencyToUSD(user.company?.budget!)}</span>
            </p>
            <p>
              Company: <span>{user.company?.name}</span>
            </p>
            <p>
              Address: <span>{user.company?.address}</span>
            </p>
          </div>

          <div className={styles.active_orders}>
            {customerActiveOrders.length === 0 && <h2>Previous orders</h2>}

            {customerActiveOrders.length > 0 && (
              <>
                <h2>Active orders</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th className={styles.hide_on_mobile}>Item</th>

                      <th className={styles.hide_on_mobile}>Quantity</th>
                      <th>Delivery date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customerActiveOrders.map((customerActiveOrder) => (
                      <tr key={customerActiveOrder._id}>
                        <td className={styles.important}>
                          <Link href={`/dashboard/${customerActiveOrder._id}`}>
                            <a>{customerActiveOrder.restaurantName}</a>
                          </Link>
                        </td>
                        <td className={styles.hide_on_mobile}>
                          {customerActiveOrder.item.name}
                        </td>
                        <td className={styles.hide_on_mobile}>
                          {customerActiveOrder.item.quantity}
                        </td>
                        <td>
                          {convertDateToText(customerActiveOrder.deliveryDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
