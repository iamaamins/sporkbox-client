import Link from 'next/link';
import { useData } from '@context/Data';
import { dateToText } from '@utils/index';
import LinkButton from '@components/layout/LinkButton';
import styles from '@styles/admin/Restaurants.module.css';

export default function Restaurants() {
  // Hooks
  const { vendors } = useData();

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
                    {dateToText(vendor.restaurant.createdAt)}
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
          linkText='Add a restaurant'
          href='/admin/restaurants/add-restaurant'
        />
      </div>
    </section>
  );
}
