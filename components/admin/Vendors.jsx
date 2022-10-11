import Link from "next/link";
import { convertDate } from "@utils/index";
import { useData } from "@context/data";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/Vendors.module.css";

export default function Vendors() {
  const { vendors } = useData();

  return (
    <section className={styles.all_vendors}>
      {vendors.length === 0 && (
        <h2 className={styles.no_vendors_title}>No vendors</h2>
      )}

      {vendors.length > 0 && (
        <>
          <h2 className={styles.all_vendors_title}>All vendors</h2>

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
                    <Link href={`/admin/vendors/${vendor.restaurant._id}`}>
                      <a>{vendor.name}</a>
                    </Link>
                  </td>
                  <td className={styles.hide_on_mobile}>{vendor.email}</td>
                  <td className={styles.hide_on_mobile}>
                    {convertDate(vendor.createdAt)}{" "}
                  </td>
                  <td>{vendor.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <LinkButton href="/admin/add-vendor" text="Add vendor" />
    </section>
  );
}
