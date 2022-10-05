import { useData } from "@context/data";
import { useEffect, useState } from "react";
import { getScheduledRestaurants } from "@utils/index";

export default function DashboardPage() {
  const { restaurants } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState(null);

  useEffect(() => {
    getScheduledRestaurants(restaurants, setScheduledRestaurants);
  }, [restaurants]);

  // Now
  const now = new Date();

  // This week Sunday and Friday
  const currSunday = now.getDate() - now.getDay();
  var currFriday = currSunday + 5;

  // Next week Sunday and Friday
  var nextSunday = new Date(now.setDate(currSunday + 7)).getDate();
  var nextFriday = new Date(now.setDate(currFriday + 7)).getDate();

  // console.log(nextSunday, nextFriday);

  return <main>DashboardPage</main>;
}
