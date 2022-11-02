import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { axiosInstance, convertDateToText } from "@utils/index";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/Restaurants.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function Restaurants() {
  // Hooks
  const router = useRouter();
  const { vendors, setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle load all vendors
  async function handleLoadAllVendors() {
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const res = await axiosInstance.get(`/vendors/0`);

      // Update state
      setVendors(res.data);

      // Remove loader
      setIsLoading(false);
    } catch (err) {
      // Remove loader
      setIsLoading(false);
      console.log(err);
    }
  }

  return (
    <section className={styles.all_restaurants}>
      {vendors.length === 0 && (
        <h2 className={styles.no_vendors_title}>No Restaurants</h2>
      )}

      {vendors.length > 0 && (
        <>
          <h2 className={styles.all_restaurants_title}>All Restaurants</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className={styles.hide_on_mobile}>Email</th>
                <th className={styles.hide_on_mobile}>Registered</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td className={styles.important}>
                    <Link href={`/admin/restaurants/${vendor.restaurant._id}`}>
                      <a>{vendor.restaurant.name}</a>
                    </Link>
                  </td>
                  <td className={styles.hide_on_mobile}>{vendor.email}</td>
                  <td className={styles.hide_on_mobile}>
                    {convertDateToText(vendor.restaurant.createdAt)}{" "}
                  </td>
                  <td>{vendor.status.toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className={styles.buttons}>
        <LinkButton
          linkText="Add a restaurant"
          href="/admin/restaurants/add-restaurant"
        />

        {router.pathname === "/admin/restaurants" && vendors.length === 25 && (
          <ActionButton
            buttonText="Load all restaurants"
            isLoading={isLoading}
            handleClick={handleLoadAllVendors}
          />
        )}
      </div>
    </section>
  );
}
