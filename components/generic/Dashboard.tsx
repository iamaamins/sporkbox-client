import Orders from "./Orders";
import { useUser } from "@context/User";
import { useData } from "@context/Data";
import { formatCurrencyToUSD } from "@utils/index";
import styles from "@styles/generic/Dashboard.module.css";

export default function Dashboard() {
  // Hooks
  const { user } = useUser();
  const { customerActiveOrders, customerDeliveredOrders } = useData();

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

          {customerActiveOrders.length > 0 && (
            <div className={styles.active_orders}>
              <h2>Active orders</h2>
              <Orders orders={customerActiveOrders} />
            </div>
          )}

          {customerDeliveredOrders.length > 0 && (
            <div className={styles.delivered_orders}>
              <h2>Delivered orders</h2>
              <Orders orders={customerDeliveredOrders} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
