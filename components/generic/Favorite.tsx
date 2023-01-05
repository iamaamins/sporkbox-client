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
  } = useData();

  return (
    <section className={styles.favorite}>
      {customerFavoriteItems.isLoading && <h2>Loading...</h2>}

      {!customerFavoriteItems.isLoading &&
        customerFavoriteItems.data.length === 0 && <h2>No favorite items</h2>}

      {customerFavoriteItems.data.length > 0 && (
        <>
          <h2 className={styles.favorite_title}>Favorite items</h2>

          <div className={styles.items}>
            {customerFavoriteItems.data.map((customerFavoriteItem) => (
              <div key={customerFavoriteItem._id} className={styles.item}>
                <div className={styles.details}>
                  <p className={styles.item_description}>
                    {customerFavoriteItem.item.name} from{" "}
                    {customerFavoriteItem.restaurant.name}
                  </p>

                  {upcomingWeekRestaurants.data.some(
                    (upcomingWeekRestaurant) =>
                      upcomingWeekRestaurant._id ===
                      customerFavoriteItem.restaurant._id
                  ) ? (
                    <div className={styles.dates}>
                      <p className={styles.available}>Available to order on</p>

                      {upcomingWeekRestaurants.data.map(
                        (upcomingWeekRestaurant, index) =>
                          upcomingWeekRestaurant._id ===
                            customerFavoriteItem.restaurant._id && (
                            <span key={index}>
                              <Link
                                href={`/place-order/${convertDateToMS(
                                  upcomingWeekRestaurant.date
                                )}/${customerFavoriteItem.restaurant._id}/${
                                  customerFavoriteItem.item._id
                                }`}
                              >
                                <a>
                                  <span>
                                    {getDay(upcomingWeekRestaurant.date)}
                                  </span>
                                  <span>
                                    {getDate(upcomingWeekRestaurant.date)}
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
                    src={
                      customerFavoriteItem.item.image ||
                      customerFavoriteItem.restaurant.logo
                    }
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
