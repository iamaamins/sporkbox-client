import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { API_URL } from "@utils/index";
import styles from "@styles/admin/Restaurant.module.css";

export default function Restaurant() {
  const router = useRouter();
  const { restaurants, setRestaurants } = useData();
  const [restaurant, setRestaurant] = useState(null);

  // Restaurant id
  const restaurantId = router.query.restaurant;

  useEffect(() => {
    setRestaurant(
      restaurants?.find((restaurant) => restaurant._id === restaurantId)
    );
  }, [restaurants]);

  // Handle approval
  async function handleApproval(e) {
    // Get current status
    const action = e.target.innerText;

    // Update restaurant status
    try {
      const res = await axios.post(
        `${API_URL}/restaurant/status`,
        { restaurantId, action },
        { withCredentials: true }
      );

      // Updated restaurant
      const updatedRestaurant = res.data;

      // Update the restaurants state
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((prevRestaurant) => {
          if (prevRestaurant._id === updatedRestaurant._id) {
            return {
              ...prevRestaurant,
              status: updatedRestaurant.status,
            };
          } else {
            return prevRestaurant;
          }
        })
      );
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
            <Link href={`/admin/restaurants/${restaurantId}/add-item`}>
              <a className={styles.add_item_button}>Add Item</a>
            </Link>

            <button
              className={styles.block_restaurant_button}
              onClick={handleApproval}
            >
              {restaurant.status === "Pending" ? "Approve" : "Restrict"}
            </button>
          </div>

          {/* Items */}
          {restaurant.items.length > 0 && (
            <div className={styles.items}>
              <p className={styles.title}>Items</p>
              {restaurant.items.map((item) => (
                <div key={item._id}>
                  <Link href={`/admin/restaurants/${restaurantId}/${item._id}`}>
                    <a className={styles.item}>
                      <div className={styles.item_details}>
                        <p className={styles.name}>{item.name}</p>
                        <p className={styles.description}>{item.description}</p>
                        <p className={styles.price}>USD ${item.price}</p>
                      </div>

                      <div className={styles.item_image}></div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
