import Link from "next/link";
import Image from "next/image";
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
import CalendarSort from "./CalendarSort";
import { IUpcomingRestaurant } from "types";
import CalendarFiltersModal from "./CalendarFiltersModal";
import styles from "@styles/generic/Calendar.module.css";
import ModalContainer from "@components/layout/ModalContainer";

export default function Calendar() {
  // Hooks
  const router = useRouter();
  const { cartItems } = useCart();
  const [sorted, setSorted] = useState({
    byLowToHigh: false,
    byHighToLow: false,
  });
  const { upcomingDates, upcomingRestaurants } = useData();
  const [showCalendarFilters, setShowCalendarFilters] = useState(false);
  const [restaurants, setRestaurants] = useState<IUpcomingRestaurant[]>([]);
  const [updatedRestaurants, setUpdatedRestaurants] = useState<
    IUpcomingRestaurant[]
  >([]);

  // Get restaurants for a date
  useEffect(() => {
    if (upcomingDates.length > 0 && router.isReady) {
      // Upcoming dates and shifts
      const upcomingDate = upcomingDates.find(
        (upcomingDate) => upcomingDate.toString() === router.query.date
      );

      if (upcomingDate) {
        // Get upcoming restaurants on a date and sort
        const upcomingRestaurantsOnDate = upcomingRestaurants.data
          .filter(
            (upcomingRestaurant) =>
              convertDateToMS(upcomingRestaurant.date) === upcomingDate
          )
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime()
          );

        // Update restaurants state
        setRestaurants(upcomingRestaurantsOnDate);
        setUpdatedRestaurants(upcomingRestaurantsOnDate);
      }
    }
  }, [upcomingDates, router]);

  console.log(restaurants);

  return (
    <>
      <section className={styles.calendar}>
        {upcomingRestaurants.isLoading && <h2>Loading...</h2>}

        {/* If there are no restaurant groups */}
        {!upcomingRestaurants.isLoading &&
          upcomingRestaurants.data.length === 0 && <h2>No restaurants</h2>}

        {/* If there are restaurant groups */}
        {upcomingDates.length > 0 && (
          <>
            {/* Show next week's and scheduled date */}
            <div className={styles.header_and_controller}>
              <div className={styles.header}>
                <h2>Upcoming week</h2>

                <CalendarSort
                  setSorted={setSorted}
                  updatedRestaurants={updatedRestaurants}
                />

                <p
                  onClick={() => setShowCalendarFilters(true)}
                  className={`${styles.filter} ${
                    showCalendarFilters && styles.active
                  }`}
                >
                  Filter
                </p>
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

            {updatedRestaurants.length > 0 ? (
              <>
                {/* Show the scheduled restaurants */}
                {updatedRestaurants.map((restaurant, index) => (
                  <div key={index} className={styles.restaurant}>
                    <h2 className={styles.restaurant_name}>
                      {restaurant.name}
                    </h2>

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
            ) : (
              <h2>No items found</h2>
            )}
          </>
        )}
      </section>

      <ModalContainer
        width="20rem"
        showModalContainer={showCalendarFilters}
        setShowModalContainer={setShowCalendarFilters}
        component={
          <CalendarFiltersModal
            restaurants={restaurants}
            setRestaurants={setRestaurants}
            setUpdatedRestaurants={setUpdatedRestaurants}
            setShowCalendarFilters={setShowCalendarFilters}
          />
        }
      />
    </>
  );
}
