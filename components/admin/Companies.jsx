import Link from "next/link";
import { useData } from "@context/data";
import styles from "@styles/admin/Companies.module.css";

export default function Companies() {
  const { companies } = useData();

  return (
    <section className={styles.all_companies}>
      {!companies && <h2>No companies</h2>}

      {companies && (
        <>
          <h2>All companies</h2>
          <div className={`${styles.title} ${styles.companies_title}`}>
            <p>Name</p>
            <p className={styles.hide_on_mobile}>Code</p>
            <p>Website</p>
            <p>Budget</p>
          </div>

          <div className={styles.companies}>
            {companies.map((company) => (
              <div key={company._id} className={styles.company}>
                <Link href={`/admin/companies/${company._id}`}>
                  <a>
                    <p>{company.name}</p>
                    <p className={styles.hide_on_mobile}>{companies.code}</p>
                    <p>{company.website}</p>
                    <p>{company.budget}</p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <Link href="/admin/add-company">
        <a className={styles.button}>Add company</a>
      </Link>
    </section>
  );
}
