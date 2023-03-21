import Link from "next/link";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useCart } from "@context/Cart";
import { useEffect, useState } from "react";
import {
  getDay,
  getDate,
  convertDateToMS,
  formatCurrencyToUSD,
} from "@utils/index";
import Image from "next/image";
import { IUpcomingRestaurant } from "types";
import FilterRestaurants from "./FilterRestaurants";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  // Hooks
  const router = useRouter();
  const { cartItems } = useCart();
  const [shifts, setShifts] = useState<string[]>([]);
  const { upcomingDates, upcomingRestaurants } = useData();
  const [restaurants, setRestaurants] = useState<IUpcomingRestaurant[]>([]);

  // Get restaurants for a date
  useEffect(() => {
    if (upcomingDates.length > 0 && router.isReady) {
      // Upcoming dates and shifts
      const upcomingDate = upcomingDates.find(
        (upcomingDate) => upcomingDate.toString() === router.query.date
      );

      if (upcomingDate) {
        // Get upcoming restaurants on a date
        const upcomingRestaurantsOnDate = upcomingRestaurants.data.filter(
          (upcomingRestaurant) =>
            convertDateToMS(upcomingRestaurant.date) === upcomingDate
        );

        // Update states
        setShifts(
          upcomingRestaurantsOnDate
            .map((el) => el.company.shift)
            .filter((el, index, shifts) => shifts.indexOf(el) === index)
        );

        // Update restaurants state
        setRestaurants(upcomingRestaurantsOnDate);
      }
    }
  }, [upcomingDates, router]);

  return (
    <section className={styles.calendar}>
      {upcomingRestaurants.isLoading && <h2>Loading...</h2>}

      {/* If there are no restaurant groups */}
      {!upcomingRestaurants.isLoading &&
        upcomingRestaurants.data.length === 0 && <h2>No restaurants</h2>}

      {/* If there are restaurant groups */}
      {upcomingDates.length > 0 && (
        <>
          {/* Show next week's and scheduled date */}
          <div className={styles.title_and_controller}>
            <div className={styles.title_and_filter}>
              <h2>Upcoming week</h2>

              {/* Show filter option if there are multiple shifts */}
              {shifts.length > 1 && (
                <FilterRestaurants
                  shifts={shifts}
                  setRestaurants={setRestaurants}
                />
              )}
            </div>

            <div className={styles.controller}>
              {upcomingDates.map((upcomingDate, index) => (
                <div key={index}>
                  <Link href={`/place-order/${upcomingDate}`}>
                    <a
                      key={index}
                      className={
                        upcomingDate.toString() === router.query.date
                          ? styles.active
                          : ""
                      }
                    >
                      <span>{getDate(upcomingDate)}</span>
                      <span>{getDay(upcomingDate)}</span>
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
                                  cartItem._id === item._id &&
                                  cartItem.companyId ===
                                    restaurant.company._id && (
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
