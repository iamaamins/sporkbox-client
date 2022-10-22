import Image from "next/image";
import { useData } from "@context/Data";
import styles from "@styles/generic/Favorite.module.css";
import { useEffect } from "react";
import LinkButton from "@components/layout/LinkButton";
import { convertDateToMilliseconds } from "@utils/index";

export default function Favorite() {
  // Hooks
  const { customerFavoriteItems, upcomingWeekRestaurants } = useData();

  // Find the favorite items that are scheduled in upcoming week

  //   useEffect(() => {
  //     if (upcomingWeekRestaurants.length > 0) {
  //       const restaurants = upcomingWeekRestaurants.map(upcomingWeekRestaurant => upcomingWeekRestaurant._id === customerFavoriteItems.)

  //       console.log(restaurants);
  //     }
  //   }, [upcomingWeekRestaurants]);

  return (
    <section className={styles.favorite}>
      {customerFavoriteItems.length === 0 && <h2>No favorite items</h2>}

      {customerFavoriteItems.length > 0 && (
        <>
          <h2 className={styles.favorite_title}>Favorite items</h2>

          <div className={styles.items}>
            {customerFavoriteItems.map((customerFavoriteItem) => (
              <div key={customerFavoriteItem._id} className={styles.item}>
                <div>
                  <p className={styles.item_name}>
                    {customerFavoriteItem.itemName} from{" "}
                    {customerFavoriteItem.restaurantName}
                  </p>

                  {upcomingWeekRestaurants.map(
                    (upcomingWeekRestaurant) =>
                      upcomingWeekRestaurant._id ===
                        customerFavoriteItem.restaurantId && (
                        <LinkButton
                          text="Order again"
                          href={`/calendar/${convertDateToMilliseconds(
                            upcomingWeekRestaurant.scheduledOn
                          )}/${customerFavoriteItem.restaurantId}/${
                            customerFavoriteItem.itemId
                          }`}
                        />
                      )
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
