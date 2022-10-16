import Link from "next/link";
import Orders from "./Orders";
import { useData } from "@context/Data";
import { convertDateToText } from "@utils/index";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/Dashboard.module.css";

export default function Dashboard() {
  const { scheduledRestaurants, companies } = useData();

  return (
    <>
      <Orders title="Active orders" />

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
