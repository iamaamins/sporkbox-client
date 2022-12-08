import Orders from "./Orders";
import Companies from "./Companies";
import { useData } from "@context/Data";
import ScheduledRestaurants from "./ScheduledRestaurants";

export default function Dashboard() {
  const { allActiveOrders } = useData();

  return (
    <>
      {/* Active orders */}
      <Orders title="Active orders" orders={allActiveOrders.data} />

      {/* Scheduled restaurants */}
      <ScheduledRestaurants />

      {/* Companies */}
      <Companies />
    </>
  );
}
