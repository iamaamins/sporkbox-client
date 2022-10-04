import Link from "next/link";
import { convertDate, createSlug } from "@utils/index";
import { useData } from "@context/data";
import styles from "@styles/admin/Dashboard.module.css";

export default function Dashboard() {
  const { restaurants, companies } = useData();

  return (
    <>
      <section className={styles.section}>
        <h2>Current orders</h2>

        <div className={`${styles.title} ${styles.orders_title}`}>
          <p>Order</p>
          <p className={styles.hide_on_mobile}>Date</p>
          <p>Status</p>
          <p className={styles.hide_on_mobile}>Total</p>
          <p>Restaurant</p>
        </div>

        <div className={styles.orders}>
          <Link href={`/admin/all-orders/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Order 1</p>
              <p className={styles.hide_on_mobile}>Sep 28, 2022</p>
              <p className={styles.gray}>Processing</p>
              <p className={styles.hide_on_mobile}>$140</p>
              <p>Restaurant 1</p>
            </a>
          </Link>

          <Link href={`/admin/all-orders/${createSlug("restaurant-name")}`}>
            <a className={styles.order}>
              <p>Order 2</p>
              <p className={styles.hide_on_mobile}>Sep 30, 2022</p>
              <p>Processing</p>
              <p className={styles.hide_on_mobile}>$180</p>
              <p>Restaurant 2</p>
            </a>
          </Link>
        </div>
      </section>

      {/* Show next week's restaurant here */}
      {restaurants && (
        <section className={styles.section}>
          <h2>Restaurants</h2>

          <div className={`${styles.title} ${styles.restaurants_title}`}>
            <p>Name</p>
            <p className={styles.hide_on_mobile}>Email</p>
            <p className={styles.hide_on_mobile}>Registered</p>
            <p>Status</p>
          </div>

          <div className={styles.restaurants}>
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className={styles.restaurant}>
                <Link href={`/admin/restaurants/${restaurant._id}`}>
                  <a>
                    <p>{restaurant.name}</p>
                    <p className={styles.hide_on_mobile}>
                      {restaurant.owner.email}
                    </p>
                    <p className={styles.hide_on_mobile}>
                      {convertDate(restaurant.createdAt)}
                    </p>
                    <p>{restaurant.status}</p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {companies && companies.length > 0 && (
        <section className={styles.section}>
          <h2>Companies</h2>

          <div className={`${styles.title} ${styles.companies_title}`}>
            <p>Name</p>
            <p className={styles.hide_on_mobile}>Website</p>
            <p>Budget</p>
          </div>

          <div className={styles.companies}>
            {companies.map((company) => (
              <Link href={`/admin/companies/${company._id}}`}>
                <a className={styles.company}>
                  <p>{company.name}</p>
                  <p className={styles.hide_on_mobile}>{company.website}</p>
                  <p>${company.budget}</p>
                </a>
              </Link>
            ))}
          </div>

          <Link href="/admin/add-company">
            <a className={styles.button}>Add company</a>
          </Link>
        </section>
      )}
    </>
  );
}
