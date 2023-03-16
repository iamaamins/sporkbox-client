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
import { IUpcomingRestaurant } from "types";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  // Hooks
  const router = useRouter();
  const { cartItems } = useCart();
  const { upcomingDatesAndShifts, upcomingRestaurants } = useData();
  const [restaurants, setRestaurants] = useState<IUpcomingRestaurant[]>([]);

  // Get restaurants for a date
  useEffect(() => {
    if (upcomingDatesAndShifts.length > 0 && router.isReady) {
      // Next week date
      const upcomingDateAndShift = upcomingDatesAndShifts.find(
        (upcomingDateAndShift) =>
          upcomingDateAndShift.date.toString() === router.query.date
      );

      if (upcomingDateAndShift) {
        // Update restaurants state
        setRestaurants(
          upcomingRestaurants.data.filter(
            (upcomingRestaurant) =>
              convertDateToMS(upcomingRestaurant.date) ===
              upcomingDateAndShift.date
          )
        );
      }
    }
  }, [upcomingDatesAndShifts, router]);

  // console.log(upcomingDatesAndShifts);

  return (
    <section className={styles.calendar}>
      {upcomingRestaurants.isLoading && <h2>Loading...</h2>}

      {/* If there are no restaurant groups */}
      {!upcomingRestaurants.isLoading &&
        upcomingRestaurants.data.length === 0 && <h2>No restaurants</h2>}

      {/* If there are restaurant groups */}
      {upcomingDatesAndShifts.length > 0 && (
        <>
          {/* Show next week's and scheduled date */}
          <div className={styles.title_and_controller}>
            <h2 className={styles.calendar_title}>Upcoming week</h2>

            <div className={styles.controller}>
              {/* TODO: Remove the filter */}
              {upcomingDatesAndShifts
                .filter(
                  (upcomingDateAndShift, index, array) =>
                    array.findIndex(
                      (element) => element.date === upcomingDateAndShift.date
                    ) === index
                )
                .map((upcomingDateAndShift, index) => (
                  <div key={index}>
                    <Link href={`/place-order/${upcomingDateAndShift.date}`}>
                      <a
                        key={index}
                        className={
                          upcomingDateAndShift.date.toString() ===
                          router.query.date
                            ? styles.active
                            : ""
                        }
                      >
                        <span>{getDate(upcomingDateAndShift.date)}</span>
                        <span>{getDay(upcomingDateAndShift.date)}</span>
                      </a>
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          {restaurants.length > 0 && (
            <>
              {/* Show the scheduled restaurants */}
              {restaurants.map((restaurant, index) => (
                <div key={index} className={styles.restaurant}>
                  <h2 className={styles.restaurant_name}>{restaurant.name}</h2>

                  <div className={styles.items}>
                    {restaurant.items.map((item) => (
                      <div key={item._id}>
                        <Link
                          href={`/place-order/${router.query.date}/${restaurant.company.shift}/${restaurant._id}/${item._id}`}
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
                                objectFit="cover"
                                layout="responsive"
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
