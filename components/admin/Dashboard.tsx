import OrdersGroups from "./OrdersGroups";
import { useData } from "@context/Data";
import ScheduledRestaurants from "./ScheduledRestaurants";

export default function Dashboard() {
  const { activeOrdersGroups } = useData();

  return (
    <>
      {/* Active orders groups */}
      <OrdersGroups title="Active orders" ordersGroups={activeOrdersGroups} />

      {/* Scheduled restaurants */}
      <ScheduledRestaurants />
    </>
  );
}
