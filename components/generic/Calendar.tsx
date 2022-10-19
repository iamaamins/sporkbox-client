import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import {
  formatCurrencyToUSD,
  groupBy,
  convertDateToMilliseconds,
} from "@utils/index";
import Image from "next/image";
import { IRestaurantsGroup, IScheduledRestaurant } from "types";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  // Hooks
  const router = useRouter();
  const { cartItems } = useCart();
  const { scheduledRestaurants: scheduled } = useData();
  const [scheduledRestaurants, setScheduledRestaurants] = useState<
    IScheduledRestaurant[]
  >([]);
  const [restaurantGroups, setRestaurantGroups] = useState<IRestaurantsGroup[]>(
    []
  );

  useEffect(() => {
    if (scheduled.length > 0 && router.isReady) {
      // Groups restaurants by scheduled on date
      const groups = groupBy("scheduledOn", scheduled, "restaurants");

      // Find the restaurant with date from slug
      const restaurants = groups.find(
        (group) =>
          convertDateToMilliseconds(group.scheduledOn).toString() ===
          router.query.date
      )?.restaurants;

      // Update restaurants
      setScheduledRestaurants(restaurants || []);

      // Update groups
      setRestaurantGroups(groups);
    }
  }, [scheduled, router]);

  // Get the date
  const getDate = (date: string) =>
    new Date(date).toDateString().split(" ").slice(2, 3).join();

  // Get the first letter of the day
  const getDay = (date: string) =>
    new Date(date).toDateString().split(" ").slice(0, 1)[0].split("")[0];

  return (
    <section className={styles.calendar}>
      {/* If there are no restaurant groups */}
      {restaurantGroups.length === 0 && <h2>No restaurants</h2>}

      {/* If there are restaurant groups */}
      {restaurantGroups.length > 0 && (
        <>
          {/* Show next week's and scheduled date */}
          <div className={styles.title_and_controller}>
            <h2 className={styles.calendar_title}>Upcoming week</h2>

            <div className={styles.controller}>
              {restaurantGroups.map((restaurantGroup) => (
                <div key={restaurantGroup.scheduledOn}>
                  <Link
                    href={`/calendar/${convertDateToMilliseconds(
                      restaurantGroup.scheduledOn
                    )}`}
                  >
                    <a
                      key={restaurantGroup.scheduledOn}
                      className={
                        convertDateToMilliseconds(
                          restaurantGroup.scheduledOn
                        ).toString() === router.query.date
                          ? styles.active
                          : ""
                      }
                    >
                      <span>{getDate(restaurantGroup.scheduledOn)}</span>
                      <span>{getDay(restaurantGroup.scheduledOn)}</span>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {scheduledRestaurants.length > 0 && (
            <>
              {/* Show the scheduled restaurants */}
              {scheduledRestaurants.map((scheduledRestaurant) => (
                <div
                  key={scheduledRestaurant._id}
                  className={styles.restaurant}
                >
                  <h2 className={styles.restaurant_name}>
                    {scheduledRestaurant.name}
                  </h2>

                  <div className={styles.items}>
                    {scheduledRestaurant.items.map((item) => (
                      <div key={item._id}>
                        <Link
                          href={`/calendar/${router.query.date}/${scheduledRestaurant.restaurantId}/${item._id}`}
                        >
                          <a className={styles.item}>
                            <div className={styles.item_details}>
                              <p className={styles.name}>{item.name}</p>
                              <p className={styles.price}>
                                {formatCurrencyToUSD(item.price)}
                              </p>
                              <p className={styles.description}>
                                {item.description}
                              </p>
                            </div>

                            <div className={styles.item_image}>
                              <Image
                                src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                                height={2}
                                width={3}
                                layout="responsive"
                                objectFit="cover"
                              />

                              {cartItems.map(
                                (cartItem) =>
                                  cartItem._id === item._id && (
                                    <span
                                      key={item._id}
                                      className={styles.quantity}
                                    >
                                      {cartItem.quantity}
                                    </span>
                                  )
                              )}
                            </div>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </section>
  );
}
