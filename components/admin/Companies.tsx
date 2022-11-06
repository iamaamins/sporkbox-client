import Link from "next/link";
import { useData } from "@context/Data";
import styles from "@styles/admin/Companies.module.css";
import LinkButton from "@components/layout/LinkButton";

export default function Companies() {
  const { companies, isAllCompaniesLoading } = useData();

  return (
    <section className={styles.all_companies}>
      {isAllCompaniesLoading && <h2>Loading...</h2>}

      {!isAllCompaniesLoading && companies.length === 0 && (
        <h2>No companies</h2>
      )}

      {companies.length > 0 && (
        <>
          <h2>All companies</h2>

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

      <LinkButton linkText="Add company" href="/admin/companies/add-company" />
    </section>
  );
}
