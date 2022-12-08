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
      const response = await axiosInstance.get(`/vendors/0`);

      // Update state
      setVendors(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.all_restaurants}>
      {vendors.isLoading && <h2>Loading...</h2>}

      {!vendors.isLoading && vendors.data.length === 0 && (
        <h2 className={styles.no_vendors_title}>No Restaurants</h2>
      )}

      {vendors.data.length > 0 && (
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
              {vendors.data.map((vendor) => (
                <tr key={vendor._id}>
                  <td className={styles.important}>
                    <Link href={`/admin/restaurants/${vendor.restaurant._id}`}>
                      <a>{vendor.restaurant.name}</a>
                    </Link>
                  </td>
                  <td className={styles.hide_on_mobile}>{vendor.email}</td>
                  <td className={styles.hide_on_mobile}>
                    {convertDateToText(vendor.restaurant.createdAt)}
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

        {router.pathname === "/admin/restaurants" &&
          vendors.data.length === 25 && (
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
