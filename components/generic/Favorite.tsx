import Image from "next/image";
import Link from "next/link";
import { useData } from "@context/Data";
import { IoMdRemove } from "react-icons/io";
import styles from "@styles/generic/Favorite.module.css";
import {
  getDate,
  getDay,
  convertDateToMS,
  handleRemoveFromFavorite,
} from "@utils/index";

export default function Favorite() {
  // Hooks
  const {
    customerFavoriteItems,
    upcomingWeekRestaurants,
    setCustomerFavoriteItems,
    isCustomerFavoriteItemsLoading,
  } = useData();

  return (
    <section className={styles.favorite}>
      {isCustomerFavoriteItemsLoading && <h2>Loading...</h2>}

      {!isCustomerFavoriteItemsLoading &&
        customerFavoriteItems.length === 0 && <h2>No favorite items</h2>}

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
                        (upcomingWeekRestaurant, index) =>
                          upcomingWeekRestaurant._id ===
                            customerFavoriteItem.restaurantId && (
                            <span key={index}>
                              <Link
                                href={`/calendar/${convertDateToMS(
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
                            </span>
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

                  <div
                    className={styles.remove}
                    onClick={() =>
                      handleRemoveFromFavorite(
                        customerFavoriteItem._id,
                        setCustomerFavoriteItems
                      )
                    }
                  >
                    <IoMdRemove />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
