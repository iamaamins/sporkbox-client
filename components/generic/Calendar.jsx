import { useData } from "@context/data";
import styles from "@styles/generic/Calendar.module.css";
import { convertDate } from "@utils/index";
import { useEffect, useState } from "react";

export default function Calendar() {
  const { scheduledRestaurants } = useData();
  const [currGroup, setCurrGroup] = useState(0);
  const [restaurantGroups, setRestaurantGroups] = useState(null);

  useEffect(() => {
    if (scheduledRestaurants) {
      // Groups restaurants by scheduled on
      const groupsObj = scheduledRestaurants.reduce(
        (acc, restaurant) => ({
          ...acc,
          [restaurant["scheduledOn"]]: [
            ...(acc[restaurant["scheduledOn"]] || []),
            restaurant,
          ],
        }),
        {}
      );

      // Convert the groups to array
      const groupsArr = Object.keys(groupsObj).map((date) => ({
        date,
        restaurants: groupsObj[date],
      }));

      // Update state
      setRestaurantGroups(groupsArr);
    }
  }, [scheduledRestaurants]);

  console.log(restaurantGroups);

  console.log(
    new Date("2022-10-18").toDateString().split(" ").slice(0, 3).join(" ")
  );

  return (
    <section className={styles.calendar}>
      <h2>Schedule</h2>
      {restaurantGroups && (
        <div>
          <div>
            <p>Upcoming week</p>
            <div>
              <p>Prev</p>
              <p>{convertDate(restaurantGroups[currGroup].date)}</p>
              <p onClick={() => setCurrGroup(currGroup + 1)}>
                {convertDate(
                  restaurantGroups[
                    currGroup < restaurantGroups[currGroup].restaurants.length
                      ? currGroup + 1
                      : currGroup
                  ].date
                )}
              </p>
            </div>
          </div>
          {restaurantGroups[currGroup].restaurants.map((restaurant) => (
            <div>
              <p>{restaurant.name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
