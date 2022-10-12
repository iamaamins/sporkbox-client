import Link from "next/link";
import { convertDateToText } from "@utils/index";
import { useData } from "@context/Data";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/Restaurants.module.css";

export default function Restaurants() {
  const { vendors } = useData();

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
                    {convertDateToText(vendor.createdAt)}{" "}
                  </td>
                  <td>{vendor.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <LinkButton href="/admin/add-restaurant" text="Add restaurant" />
    </section>
  );
}
