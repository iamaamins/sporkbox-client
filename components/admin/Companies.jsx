import Link from "next/link";
import { useData } from "@context/data";
import styles from "@styles/admin/Companies.module.css";

export default function Companies() {
  const { companies } = useData();

  return (
    <section className={styles.all_companies}>
      {(!companies || companies.length === 0) && <h2>No companies</h2>}

      {companies && companies.length > 0 && (
        <>
          <h2 className={styles.all_companies_title}>All companies</h2>

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
        </>
      )}

      <Link href="/admin/add-company">
        <a className={styles.button}>Add company</a>
      </Link>
    </section>
  );
}
