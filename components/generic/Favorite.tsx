import Link from "next/link";
import Image from "next/image";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { IoMdRemove } from "react-icons/io";
import {
  getDate,
  getDay,
  convertDateToMS,
  handleRemoveFromFavorite,
} from "@utils/index";
import styles from "@styles/generic/Favorite.module.css";

export default function Favorite() {
  // Hooks
  const { setAlerts } = useAlert();
  const {
    customerFavoriteItems,
    upcomingRestaurants,
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

                  {upcomingRestaurants.data.some(
                    (upcomingRestaurant) =>
                      upcomingRestaurant._id ===
                      customerFavoriteItem.restaurant._id
                  ) ? (
                    <div className={styles.dates}>
                      <p className={styles.available}>Available to order on</p>

                      {upcomingRestaurants.data.map(
                        (upcomingRestaurant, index) =>
                          upcomingRestaurant._id ===
                            customerFavoriteItem.restaurant._id && (
                            <span key={index}>
                              <Link
                                href={`/place-order/${convertDateToMS(
                                  upcomingRestaurant.date
                                )}/${upcomingRestaurant.company.shift}/${
                                  customerFavoriteItem.restaurant._id
                                }/${customerFavoriteItem.item._id}`}
                              >
                                <a>
                                  <span>{getDay(upcomingRestaurant.date)}</span>
                                  <span>
                                    {getDate(upcomingRestaurant.date)}
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
                    src={customerFavoriteItem.item.image}
                    height={2}
                    width={3}
                    layout="responsive"
                    objectFit="cover"
                  />

                  <div
                    className={styles.remove}
                    onClick={() =>
                      handleRemoveFromFavorite(
                        setAlerts,
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
