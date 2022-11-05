import Image from "next/image";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  axiosInstance,
  formatCurrencyToUSD,
  updateVendors,
} from "@utils/index";
import Buttons from "@components/layout/Buttons";
import styles from "@styles/admin/Item.module.css";
import { IItem } from "types";

export default function Item() {
  const router = useRouter();
  const { vendors, setVendors } = useData();
  const [item, setItem] = useState<IItem>();

  // Get the item
  useEffect(() => {
    if (vendors.length > 0 && router.isReady) {
      setItem(
        vendors
          .find((vendor) => vendor.restaurant._id === router.query.restaurant)
          ?.restaurant.items.find((item) => item._id === router.query.item)
      );
    }
  }, [vendors, router.isReady]);

  // Handle delete
  async function handleDelete() {
    // Delete an item
    try {
      // Send the request to backend
      const response = await axiosInstance.delete(
        `/restaurants/${router.query.restaurant}/${router.query.item}/delete-item`
      );

      // Updated vendors array with updated items
      updateVendors(response.data, setVendors);

      // Bck to the restaurant page
      router.back();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.item}>
      {!item && <h2>No item found</h2>}

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
            <p className={styles.price}>{formatCurrencyToUSD(item.price)}</p>
            <p className={styles.tags}>
              {item.tags.split(",").map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </p>

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
