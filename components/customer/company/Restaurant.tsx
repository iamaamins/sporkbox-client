import styles from './Restaurant.module.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { axiosInstance, dateToText, showErrorAlert } from '@lib/utils';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { useUser } from '@context/User';
import { Alert, CustomAxiosError, Customer, ScheduledRestaurant } from 'types';
import { useAlert } from '@context/Alert';

export default function Restaurant() {
  return (
    <section className={styles.container}>
      <h2>Restaurant</h2>
      <ScheduledRestaurants />
      <MostLikedRestaurants />
      <MostLikedItems />
    </section>
  );
}

type ScheduledRestaurantGroup = { date: string; restaurants: string[] };
function ScheduledRestaurants() {
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [scheduledRestaurants, setScheduledRestaurants] = useState<{
    isLoading: boolean;
    data: ScheduledRestaurant[];
  }>({ isLoading: true, data: [] });
  const [weekId, setWeekId] = useState(0);
  const [groups, setGroups] = useState<ScheduledRestaurantGroup[]>([]);

  // Create groups
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

  // Get scheduled restaurants
  useEffect(() => {
    async function getScheduledRestaurants(customer: Customer) {
      try {
        const response = await axiosInstance.get(
          `/restaurants/${customer.companies[0].code}/scheduled-restaurants`
        );
        setScheduledRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        setScheduledRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (customer) getScheduledRestaurants(customer);
  }, [customer]);

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

function getPastDate(days: number) {
  return new Date(new Date().setDate(new Date().getDate() - days))
    .toISOString()
    .split('T')[0];
}

async function getRestaurantStat<T>(
  range: Range,
  statType: 'restaurants' | 'items',
  customer: Customer,
  setStat: Dispatch<SetStateAction<T>>,
  setAlerts: Dispatch<SetStateAction<Alert[]>>
) {
  let start = '';
  let end = '';
  if (range.start && range.end) {
    start = range.start;
    end = range.end;
  } else {
    start = getPastDate(60);
    end = getPastDate(0);
  }

  try {
    const response = await axiosInstance.get(
      `/orders/${customer.companies[0].code}/restaurant-stat/${start}/${end}`
    );

    setStat((prevState) => ({
      ...prevState,
      data: response.data[statType],
    }));
  } catch (err) {
    showErrorAlert(err as CustomAxiosError, setAlerts);
  } finally {
    setStat((prevState) => ({
      ...prevState,
      isLoading: false,
    }));
  }
}

type Range = { start: string; end: string };
type DateRangePickerProps = {
  range: Range;
  setRange: Dispatch<SetStateAction<Range>>;
};
function DateRangePicker({ range, setRange }: DateRangePickerProps) {
  return (
    <form className={styles.range_selector}>
      <div className={styles.range_selector_item}>
        <label htmlFor='start'>From</label>
        <input
          type='date'
          id='start'
          max={getPastDate(0)}
          value={range.start}
          onChange={(e) =>
            setRange((prevState) => ({
              ...prevState,
              start: e.target.value,
            }))
          }
        />
      </div>
      <div className={styles.range_selector_item}>
        <label htmlFor='end'>To</label>
        <input
          type='date'
          id='end'
          value={range.end}
          max={getPastDate(0)}
          onChange={(e) =>
            setRange((prevState) => ({
              ...prevState,
              end: e.target.value,
            }))
          }
        />
      </div>
    </form>
  );
}

type MostLikedRestaurants = {
  isLoading: boolean;
  data: {
    name: string;
    orderCount: number;
  }[];
};
function MostLikedRestaurants() {
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [mostLikedRestaurants, setMostLikedRestaurants] =
    useState<MostLikedRestaurants>({
      isLoading: true,
      data: [],
    });
  const [range, setRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (customer)
      getRestaurantStat(
        range,
        'restaurants',
        customer,
        setMostLikedRestaurants,
        setAlerts
      );
  }, [customer, range]);

  return (
    <div className={styles.most_liked_restaurants}>
      <h3>Most liked restaurants</h3>
      <DateRangePicker range={range} setRange={setRange} />
      {mostLikedRestaurants.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : mostLikedRestaurants.data.length === 0 ? (
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
            {mostLikedRestaurants.data.map((restaurant, index) => (
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

type MostLikedItems = {
  isLoading: boolean;
  data: {
    name: string;
    restaurant: string;
    orderCount: number;
  }[];
};
function MostLikedItems() {
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [mostLikedItems, setMostLikedItems] = useState<MostLikedItems>({
    isLoading: true,
    data: [],
  });
  const [range, setRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (customer)
      getRestaurantStat(range, 'items', customer, setMostLikedItems, setAlerts);
  }, [customer, range]);

  return (
    <div className={styles.most_liked_items}>
      <h3>Most liked items</h3>
      <DateRangePicker range={range} setRange={setRange} />
      {mostLikedItems.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : mostLikedItems.data.length === 0 ? (
        <p className={styles.message}>No items found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Restaurant</th>
              <th>Order count</th>
            </tr>
          </thead>
          <tbody>
            {mostLikedItems.data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.restaurant}</td>
                <td>{item.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
