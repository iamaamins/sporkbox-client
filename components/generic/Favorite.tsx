import Image from "next/image";
import { useData } from "@context/Data";
import LinkButton from "@components/layout/LinkButton";
import {
  convertDateToMilliseconds,
  convertDateToText,
  getDate,
  getDay,
} from "@utils/index";
import styles from "@styles/generic/Favorite.module.css";
import Link from "next/link";

export default function Favorite() {
  // Hooks
  const { customerFavoriteItems, upcomingWeekRestaurants } = useData();

  return (
    <section className={styles.favorite}>
      {customerFavoriteItems.length === 0 && <h2>No favorite items</h2>}

      {customerFavoriteItems.length > 0 && (
        <>
          <h2 className={styles.favorite_title}>Favorite items</h2>

          <div className={styles.items}>
            {customerFavoriteItems.map((customerFavoriteItem) => (
              <div key={customerFavoriteItem._id} className={styles.item}>
                <div className={styles.details}>
                  <p className={styles.item_description}>
                    {customerFavoriteItem.itemName} from{" "}
                    {customerFavoriteItem.restaurantName}
                  </p>

                  {upcomingWeekRestaurants.some(
                    (upcomingWeekRestaurant) =>
                      upcomingWeekRestaurant._id ===
                      customerFavoriteItem.restaurantId
                  ) ? (
                    <div className={styles.dates}>
                      <p className={styles.available}>Available to order on</p>

                      {upcomingWeekRestaurants.map(
                        (upcomingWeekRestaurant) =>
                          upcomingWeekRestaurant._id ===
                            customerFavoriteItem.restaurantId && (
                            <>
                              <Link
                                href={`/calendar/${convertDateToMilliseconds(
                                  upcomingWeekRestaurant.scheduledOn
                                )}/${customerFavoriteItem.restaurantId}/${
                                  customerFavoriteItem.itemId
                                }`}
                              >
                                <a>
                                  <span>
                                    {getDay(upcomingWeekRestaurant.scheduledOn)}
                                  </span>
                                  <span>
                                    {getDate(
                                      upcomingWeekRestaurant.scheduledOn
                                    )}
                                  </span>
                                </a>
                              </Link>
                            </>
                          )
                      )}
                    </div>
                  ) : (
                    <p className={styles.not_available}>
                      Not available to order
                    </p>
                  )}
                </div>

                <div className={styles.cover_image}>
                  <Image
                    src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                    height={2}
                    width={3}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
