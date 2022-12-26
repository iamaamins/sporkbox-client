import Link from "next/link";
import Image from "next/image";
import { IVendor } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import Buttons from "@components/layout/Buttons";
import { FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/Restaurant.module.css";
import {
  axiosInstance,
  formatCurrencyToUSD,
  updateVendors,
} from "@utils/index";

export default function Restaurant() {
  const router = useRouter();
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<IVendor>();

  // Get the restaurant
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      setVendor(
        vendors.data.find(
          (vendor) => vendor.restaurant._id === router.query.restaurant
        )
      );
    }
  }, [vendors, router.isReady]);

  // Handle approval
  async function handleApproval(e: FormEvent) {
    // Get current status
    const action = e.currentTarget.textContent;

    // Update restaurant status
    try {
      const response = await axiosInstance.put(
        `/vendors/${vendor?._id}/status`,
        {
          action,
        }
      );

      // Update vendors with updates status
      updateVendors(response.data, setVendors);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.restaurant}>
      {!vendor && <h2>No restaurant found</h2>}

      {vendor && (
        <div className={styles.details_and_items}>
          <div className={styles.details}>
            <div className={styles.restaurant_details}>
              <h2 className={styles.restaurant_name}>
                {vendor.restaurant.name}
              </h2>
              <p>
                <span>Contact:</span> {vendor.firstName} {vendor.lastName}
              </p>
              <p>
                <span>Email:</span> {vendor.email}
              </p>

              <p>
                <span>Address:</span> {vendor.restaurant.address}
              </p>
            </div>

            {/* Buttons */}
            <div className={styles.buttons}>
              <Buttons
                handleClick={handleApproval}
                linkText="Add item"
                buttonText={
                  vendor.status === "PENDING" ? "Approve" : "Restrict"
                }
                href={`/admin/restaurants/${vendor.restaurant._id}/add-item`}
              />

              <Link
                href={`/admin/restaurants/${vendor.restaurant._id}/edit-restaurant`}
              >
                <a className={styles.edit_restaurant_button}>Edit details</a>
              </Link>
            </div>
          </div>

          {/* Items */}
          {vendor.restaurant.items.length > 0 && (
            <>
              <h2 className={styles.items_title}>Items</h2>
              <div className={styles.items}>
                {vendor.restaurant.items.map((item) => (
                  <div key={item._id}>
                    <Link
                      href={`/admin/restaurants/${vendor.restaurant._id}/${item._id}`}
                    >
                      <a className={styles.item}>
                        <div className={styles.item_details}>
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.price}>
                            {formatCurrencyToUSD(item.price)}
                          </p>
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
