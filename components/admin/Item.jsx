import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import styles from "@styles/admin/Item.module.css";
import { updateRestaurants } from "@utils/index";
import Buttons from "@components/layout/Buttons";
import Image from "next/image";

export default function Item() {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const { restaurants, setRestaurants } = useData();

  useEffect(() => {
    if (restaurants && router.isReady) {
      setItem(
        restaurants
          ?.find((restaurant) => restaurant._id === router.query.restaurant)
          .items?.find((item) => item._id === router.query.item)
      );
    }
  }, [restaurants, router.isReady]);

  // Handle delete
  async function handleDelete() {
    // Delete an item
    try {
      // Send the request to backend
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${router.query.restaurant}/${router.query.item}/delete-item`,
        { withCredentials: true }
      );

      // Updated restaurants array with updated items
      updateRestaurants(res, "items", setRestaurants);

      // Bck to the restaurant page
      router.back();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.item}>
      {!item && <h2>No item</h2>}
      {item && (
        <>
          <div className={styles.cover_image}>
            <Image
              src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              height={2}
              width={3}
              layout="responsive"
              objectFit="cover"
            />
          </div>

          <div className={styles.item_details}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.price}>USD ${item.price}</p>
            <p className={styles.tags}>{item.tags}</p>

            {/* Buttons */}
            <Buttons
              handleClick={handleDelete}
              linkText="Edit item"
              buttonText="Delete item"
              href={`/admin/restaurants/${router.query.restaurant}/${router.query.item}/edit-item`}
            />
          </div>
        </>
      )}
    </section>
  );
}
