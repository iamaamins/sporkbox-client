import Orders from "./Orders";
import { useState } from "react";
import { AxiosError } from "axios";
import { IAxiosError } from "types";
import { useUser } from "@context/User";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import styles from "@styles/generic/Dashboard.module.css";
import ActionButton from "@components/layout/ActionButton";
import {
  axiosInstance,
  formatCurrencyToUSD,
  showErrorAlert,
} from "@utils/index";

export default function Dashboard() {
  // Hooks
  const { user } = useUser();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const {
    customerUpcomingOrders,
    customerDeliveredOrders,
    setCustomerDeliveredOrders,
  } = useData();

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
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
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
            <h2>Welcome {user.firstName}</h2>
            <p>
              Daily budget:{" "}
              <span>{formatCurrencyToUSD(user.company?.dailyBudget!)}</span>
            </p>
            <p>
              Company: <span>{user.company?.name}</span>
            </p>
            <p>
              Address:{" "}
              <span>
                {user.company?.address.addressLine2 ? (
                  <>
                    {user.company?.address.addressLine1},{" "}
                    {user.company?.address.addressLine2},{" "}
                    {user.company?.address.city}, {user.company?.address.state}{" "}
                    {user.company?.address.zip}
                  </>
                ) : (
                  <>
                    {user.company?.address.addressLine1},{" "}
                    {user.company?.address.city}, {user.company?.address.state}{" "}
                    {user.company?.address.zip}
                  </>
                )}
              </span>
            </p>
          </div>

          {customerUpcomingOrders.isLoading && <h2>Loading...</h2>}

          {/* Active orders */}
          {customerUpcomingOrders.data.length > 0 && (
            <div className={styles.active_orders}>
              <h2>Active orders</h2>
              <Orders orders={customerUpcomingOrders.data} />
            </div>
          )}

          {customerDeliveredOrders.isLoading && <h2>Loading...</h2>}

          {/* Delivered orders */}
          {customerDeliveredOrders.data.length > 0 && (
            <div className={styles.delivered_orders}>
              <h2>Delivered orders</h2>

              <Orders orders={customerDeliveredOrders.data} />

              {customerDeliveredOrders.data.length === 10 && (
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
