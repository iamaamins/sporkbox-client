import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useUser } from "@context/User";
import {
  getDay,
  getDate,
  formatCurrencyToUSD,
  convertDateToMS,
} from "@utils/index";
import Image from "next/image";
import { IUpcomingWeekRestaurant } from "types";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  // Hooks
  const { user } = useUser();
  const router = useRouter();
  const { cartItems } = useCart();
  const { nextWeekDates, upcomingWeekRestaurants } = useData();
  const [restaurants, setRestaurants] = useState<IUpcomingWeekRestaurant[]>([]);

  // Get restaurants for a date
  useEffect(() => {
    if (nextWeekDates.length > 0 && router.isReady) {
      // Next week date
      const nextWeekDate = nextWeekDates.find(
        (nextWeekDate) => nextWeekDate.toString() === router.query.date
      );

      // Update restaurants state
      setRestaurants(
        upcomingWeekRestaurants.data.filter(
          (upcomingWeekRestaurant) =>
            convertDateToMS(upcomingWeekRestaurant.date) === nextWeekDate
        )
      );
    }
  }, [nextWeekDates, router]);

  return (
    <section className={styles.calendar}>
      {upcomingWeekRestaurants.isLoading && <h2>Loading...</h2>}

      {/* If there are no restaurant groups */}
      {!upcomingWeekRestaurants.isLoading &&
        upcomingWeekRestaurants.data.length === 0 && <h2>No restaurants</h2>}

      {/* If there are restaurant groups */}
      {nextWeekDates.length > 0 && (
        <>
          {/* Show next week's and scheduled date */}
          <div className={styles.title_and_controller}>
            <h2 className={styles.calendar_title}>Upcoming week</h2>

            <div className={styles.controller}>
              {nextWeekDates.map((nextWeekDate) => (
                <div key={nextWeekDate}>
                  <Link href={`/place-order/${nextWeekDate}`}>
                    <a
                      key={nextWeekDate}
                      className={
                        nextWeekDate.toString() === router.query.date
                          ? styles.active
                          : ""
                      }
                    >
                      <span>{getDate(nextWeekDate)}</span>
                      <span>{getDay(nextWeekDate)}</span>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {restaurants.length > 0 && (
            <>
              {/* Show the scheduled restaurants */}
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className={styles.restaurant}>
                  <h2 className={styles.restaurant_name}>{restaurant.name}</h2>

                  <div className={styles.items}>
                    {restaurant.items.map((item) => (
                      <div key={item._id}>
                        <Link
                          href={`/place-order/${router.query.date}/${restaurant._id}/${item._id}`}
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
                                src={item.image || restaurant.logo}
                                width={16}
                                height={10}
                                layout="responsive"
                                objectFit="cover"
                              />

                              {cartItems.map(
                                (cartItem) =>
                                  cartItem.deliveryDate.toString() ===
                                    router.query.date &&
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
