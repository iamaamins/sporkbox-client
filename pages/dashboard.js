import { useData } from "@context/data";
import { useEffect, useState } from "react";
import { getScheduledRestaurants } from "@utils/index";

export default function DashboardPage() {
  const { restaurants } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState(null);

  useEffect(() => {
    getScheduledRestaurants(restaurants, setScheduledRestaurants);
  }, [restaurants]);

  function getDate(dayToAdd) {
    // Now
    const now = new Date("2022-10-09");

    // Day number
    const sunday = now.getDate() - now.getDay();

    // Return date
    return new Date(now.setDate(sunday + dayToAdd));
  }

  const nextWeekSunday = getDate(7);
  const nextWeekFriday = getDate(12);
  const nextTwoWeekSunday = getDate(14);
  const nextTwoWeekFriday = getDate(19);

  // console.log(getDate(14), getDate(19));

  return <main>DashboardPage</main>;
}
