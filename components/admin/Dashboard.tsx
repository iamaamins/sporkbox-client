import Orders from "./OrdersGroups";
import { useData } from "@context/Data";
import ScheduledRestaurants from "./ScheduledRestaurants";

export default function Dashboard() {
  const { activeOrdersGroups } = useData();

  return (
    <>
      {/* Active orders */}
      <Orders title="Active orders" ordersGroups={activeOrdersGroups} />

      {/* Scheduled restaurants */}
      <ScheduledRestaurants />
    </>
  );
}
