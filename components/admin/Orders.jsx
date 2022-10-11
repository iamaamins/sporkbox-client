import Link from "next/link";
import { convertDate } from "@utils/index";
import { useData } from "@context/data";
import styles from "@styles/admin/Orders.module.css";

export default function Orders() {
  const { restaurants } = useData();
  return (
    <section className={styles.section}>
      <h2 className={styles.all_orders_title}>All orders</h2>

      {/* Current orders */}
      {/* <div className={styles.orders}>
        {restaurants && (
          <table>
            <thead>
              <tr>
                <th>Order#</th>
                <th className={styles.hide_on_mobile}>Create on</th>
                <th className={styles.hide_on_mobile}>Restaurant</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td className={styles.important}>
                    <Link href={`/admin/vendors/${restaurant._id}`}>
                      <a>{restaurant.name}</a>
                    </Link>
                  </td>
                  <td className={styles.hide_on_mobile}>
                    {restaurant.owner.email}
                  </td>
                  <td className={styles.hide_on_mobile}>
                    {convertDate(restaurant.createdAt)}{" "}
                  </td>
                  <td>{restaurant.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}
    </section>
  );
}
