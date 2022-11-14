import Orders from "./Orders";
import { useState } from "react";
import { useUser } from "@context/User";
import { useData } from "@context/Data";
import styles from "@styles/generic/Dashboard.module.css";
import ActionButton from "@components/layout/ActionButton";
import { axiosInstance, formatCurrencyToUSD } from "@utils/index";

export default function Dashboard() {
  // Hooks
  const { user } = useUser();
  const {
    setCustomerDeliveredOrders,
    isCustomerActiveOrdersLoading,
    isCustomerDeliveredOrdersLoading,
  } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const { customerActiveOrders, customerDeliveredOrders } = useData();

  // Handle load all delivered orders
  async function handleLoadAllDeliveredOrders() {
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.get(`/orders/me/delivered/0`);

      // Update state
      setCustomerDeliveredOrders(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.dashboard}>
      {user && (
        <>
          <div className={styles.details}>
            <h2>Welcome {user.name}</h2>
            <p>
              Daily budget:{" "}
              <span>{formatCurrencyToUSD(user.company?.dailyBudget!)}</span>
            </p>
            <p>
              Company: <span>{user.company?.name}</span>
            </p>
            <p>
              Address: <span>{user.company?.address}</span>
            </p>
          </div>

          {isCustomerActiveOrdersLoading && <h2>Loading...</h2>}

          {/* Active orders */}
          {customerActiveOrders.length > 0 && (
            <div className={styles.active_orders}>
              <h2>Active orders</h2>
              <Orders orders={customerActiveOrders} />
            </div>
          )}

          {isCustomerDeliveredOrdersLoading && <h2>Loading...</h2>}

          {/* Delivered orders */}
          {customerDeliveredOrders.length > 0 && (
            <div className={styles.delivered_orders}>
              <h2>Delivered orders</h2>

              <Orders orders={customerDeliveredOrders} />

              {customerDeliveredOrders.length === 10 && (
                <span className={styles.load_all}>
                  <ActionButton
                    buttonText="Load all orders"
                    isLoading={isLoading}
                    handleClick={handleLoadAllDeliveredOrders}
                  />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
