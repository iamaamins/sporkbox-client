import { useData } from '@context/Data';
import styles from './Restaurant.module.css';
import { useEffect, useState } from 'react';
import { dateToText } from '@lib/utils';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';

export default function Restaurant() {
  return (
    <section className={styles.container}>
      <h2>Restaurant</h2>
      <ScheduledRestaurants />
    </section>
  );
}

type ScheduledRestaurantGroup = { date: string; restaurants: string[] };
function ScheduledRestaurants() {
  const { scheduledRestaurants } = useData();
  const [weekId, setWeekId] = useState(0);
  const [groups, setGroups] = useState<ScheduledRestaurantGroup[]>([]);

  useEffect(() => {
    if (!scheduledRestaurants.isLoading && scheduledRestaurants.data.length) {
      const restaurantMap: Record<string, ScheduledRestaurantGroup> = {};
      for (const restaurant of scheduledRestaurants.data) {
        const key = restaurant.schedule.date;
        if (!restaurantMap[key]) {
          restaurantMap[key] = {
            date: key,
            restaurants: [restaurant.name],
          };
        } else {
          !restaurantMap[key].restaurants.includes(restaurant.name) &&
            restaurantMap[key].restaurants.push(restaurant.name);
        }
      }
      setGroups(Object.values(restaurantMap));
    }
  }, [scheduledRestaurants]);

  return (
    <div>
      <div className={styles.week_navigator}>
        <button
          disabled={weekId === 0}
          onClick={() =>
            setWeekId((prevState) =>
              prevState > 0 ? prevState - 1 : prevState
            )
          }
        >
          <IoIosArrowRoundBack size={20} /> Prev week
        </button>
        <button
          disabled={weekId * 7 + 7 >= groups.length}
          onClick={() =>
            setWeekId((prevState) =>
              prevState * 7 + 7 < groups.length ? prevState + 1 : prevState
            )
          }
        >
          Next week <IoIosArrowRoundForward size={20} />
        </button>
      </div>
      {scheduledRestaurants.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : scheduledRestaurants.data.length === 0 ? (
        <p className={styles.message}>No restaurants found</p>
      ) : (
        <div className={styles.scheduled_restaurants}>
          {groups.slice(weekId * 7, weekId * 7 + 7).map((group, gidx) => (
            <div key={gidx}>
              <p className={styles.date}>{dateToText(group.date)}</p>
              {group.restaurants.map((restaurant, ridx) => (
                <p key={ridx}>{restaurant}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
