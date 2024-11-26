import { useData } from '@context/Data';
import styles from './Restaurant.module.css';
import { useEffect, useState } from 'react';
import { axiosInstance, dateToText, showErrorAlert } from '@lib/utils';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { useUser } from '@context/User';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';

export default function Restaurant() {
  return (
    <section className={styles.container}>
      <h2>Restaurant</h2>
      <ScheduledRestaurants />
      <TopRatedRestaurants />
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
    <div className={styles.scheduled_restaurants}>
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
        <div className={styles.groups}>
          {groups.slice(weekId * 7, weekId * 7 + 7).map((group, gidx) => (
            <div key={gidx} className={styles.group}>
              <p className={styles.date}>{dateToText(group.date)}</p>
              <div className={styles.restaurants}>
                {group.restaurants.map((restaurant, ridx) => (
                  <p key={ridx}>{restaurant}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type TopRatedRestaurants = {
  isLoading: boolean;
  data: {
    name: string;
    orderCount: number;
  }[];
};
function TopRatedRestaurants() {
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const [topRatedRestaurants, setTopRatedRestaurants] =
    useState<TopRatedRestaurants>({
      isLoading: true,
      data: [],
    });

  useEffect(() => {
    async function getTopRatedRestaurants() {
      try {
        const response = await axiosInstance.get(
          '/orders/top-rated-restaurants'
        );
        setTopRatedRestaurants((prevState) => ({
          ...prevState,
          data: response.data,
        }));
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setTopRatedRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    }

    if (isAdmin) getTopRatedRestaurants();
  }, [isAdmin]);

  return (
    <div className={styles.top_rated_restaurants}>
      <h3>Top rated restaurants</h3>
      {topRatedRestaurants.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : topRatedRestaurants.data.length === 0 ? (
        <p className={styles.message}>No restaurant found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Order count</th>
            </tr>
          </thead>
          <tbody>
            {topRatedRestaurants.data.map((restaurant, index) => (
              <tr key={index}>
                <td>{restaurant.name}</td>
                <td>{restaurant.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
