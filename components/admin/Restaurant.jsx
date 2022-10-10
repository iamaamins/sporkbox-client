import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { updateRestaurants } from "@utils/index";
import styles from "@styles/admin/Restaurant.module.css";
import Buttons from "@components/layout/Buttons";
import Image from "next/image";

export default function Restaurant() {
  const router = useRouter();
  const { restaurants, setRestaurants } = useData();
  const [restaurant, setRestaurant] = useState(null);

  // Get the restaurant
  useEffect(() => {
    if (restaurants && router.isReady) {
      setRestaurant(
        restaurants?.find(
          (restaurant) => restaurant._id === router.query.restaurant
        )
      );
    }
  }, [restaurants, router.isReady]);

  // Handle approval
  async function handleApproval(e) {
    // Get current status
    const action = e.target.innerText;

    // Update restaurant status
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${router.query.restaurant}/status`,
        { action },
        { withCredentials: true }
      );

      // Update restaurants with updates status
      updateRestaurants(res, "status", setRestaurants);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.restaurant}>
      {!restaurant && <h2>No restaurant</h2>}

      {restaurant && (
        <div className={styles.details_and_items}>
          <div className={styles.details}>
            <div className={styles.restaurant_details}>
              <h2 className={styles.restaurant_name}>{restaurant.name}</h2>
              <p>
                <span>Owner:</span> {restaurant.owner.name}
              </p>
              <p>
                <span>Email:</span> {restaurant.owner.email}
              </p>

              <p>
                <span>Address:</span> {restaurant.address}
              </p>
            </div>

            {/* Buttons */}
            <Buttons
              handleClick={handleApproval}
              linkText="Add item"
              status={restaurant.status}
              href={`/admin/restaurants/${router.query.restaurant}/add-item`}
            />
          </div>

          {/* Items */}
          {restaurant.items.length > 0 && (
            <>
              <h2 className={styles.items_title}>Items</h2>
              <div className={styles.items}>
                {restaurant.items.map((item) => (
                  <div key={item._id}>
                    <Link
                      href={`/admin/restaurants/${router.query.restaurant}/${item._id}`}
                    >
                      <a className={styles.item}>
                        <div className={styles.item_details}>
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.price}>USD ${item.price}</p>
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
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
