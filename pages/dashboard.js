import { useData } from "@context/data";
import { useEffect, useState } from "react";
import { getScheduledRestaurants } from "@utils/index";

export default function DashboardPage() {
  const { restaurants } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState(null);

  useEffect(() => {
    getScheduledRestaurants(restaurants, setScheduledRestaurants);
  }, [restaurants]);

  return <main>DashboardPage</main>;
}
