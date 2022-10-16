import Link from "next/link";
import { convertDateToText } from "@utils/index";
import { useData } from "@context/Data";
import styles from "@styles/admin/Dashboard.module.css";
import LinkButton from "@components/layout/LinkButton";

export default function Dashboard() {
  const { activeOrders, scheduledRestaurants, companies } = useData();

  return (
    <>
      {activeOrders.length > 0 && (
        <section className={styles.section}>
          <h2>Active orders</h2>

          {/* Active orders */}
          <div className={styles.active_orders}>
            <table>
              <thead>
                <tr>
                  <th>Order#</th>
                  <th className={styles.hide_on_mobile}>Created on</th>
                  <th className={styles.hide_on_mobile}>Restaurant</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {activeOrders.map((activeOrder) => (
                  <tr key={activeOrder._id}>
                    <td className={styles.important}>
                      <Link href={`/admin/restaurants/${activeOrder._id}`}>
                        <a>{activeOrder.customerName}</a>
                      </Link>
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {activeOrder.deliveryDate}
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {convertDateToText(activeOrder.restaurantName)}
                    </td>
                    <td>{activeOrder.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Scheduled restaurants */}
      {scheduledRestaurants.length > 0 && (
        <section className={styles.section}>
          <h2>Scheduled restaurants</h2>

          <div className={styles.restaurants}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Scheduled on</th>
                </tr>
              </thead>

              <tbody>
                {scheduledRestaurants.map((scheduledRestaurant) => (
                  <tr key={scheduledRestaurant._id}>
                    <td className={styles.important}>
                      <Link
                        href={`/admin/restaurants/${scheduledRestaurant._id}`}
                      >
                        <a>{scheduledRestaurant.name}</a>
                      </Link>
                    </td>
                    <td>
                      {convertDateToText(scheduledRestaurant.scheduledOn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LinkButton href="/admin/schedule-restaurants" text="Schedule more" />
        </section>
      )}

      {/* Companies */}
      {companies && companies.length > 0 && (
        <section className={styles.section}>
          <h2>Companies</h2>

          <div className={styles.companies}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className={styles.hide_on_mobile}>Website</th>
                  <th className={styles.hide_on_mobile}>Code</th>
                  <th>Budget</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td className={styles.important}>
                      <Link href={`/admin/companies/${company._id}`}>
                        <a>{company.name}</a>
                      </Link>
                    </td>
                    <td className={styles.hide_on_mobile}>{company.website}</td>
                    <td className={styles.hide_on_mobile}>{company.code}</td>
                    <td>${company.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LinkButton href="/admin/add-company" text="Add company" />
        </section>
      )}
    </>
  );
}
