import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { updateRestaurants } from "@utils/index";
import styles from "@styles/admin/Restaurant.module.css";

export default function Restaurant() {
  const router = useRouter();
  const { restaurants, setRestaurants } = useData();
  const [restaurant, setRestaurant] = useState(null);

  // Get the restaurant
  useEffect(() => {
    if (restaurants) {
      setRestaurant(
        restaurants?.find(
          (restaurant) => restaurant._id === router.query.restaurant
        )
      );
    }
  }, [restaurants]);

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
            <h2>{restaurant.name}</h2>
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
          <div className={styles.buttons}>
            <Link
              href={`/admin/restaurants/${router.query.restaurant}/add-item`}
            >
              <a className={styles.add_item_button}>Add Item</a>
            </Link>

            <button
              onClick={handleApproval}
              className={styles.block_restaurant_button}
            >
              {restaurant.status === "PENDING" ? "Approve" : "Restrict"}
            </button>
          </div>

          {/* Items */}
          {restaurant.items.length > 0 && (
            <>
              <h2>Items</h2>
              <div className={styles.items}>
                {restaurant.items.map((item) => (
                  <div key={item._id}>
                    <Link
                      href={`/admin/restaurants/${router.query.restaurant}/${item._id}`}
                    >
                      <a className={styles.item}>
                        <div className={styles.item_details}>
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.description}>
                            {item.description}
                          </p>
                          <p className={styles.price}>USD ${item.price}</p>
                        </div>

                        <div className={styles.item_image}></div>
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
