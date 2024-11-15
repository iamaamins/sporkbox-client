import Link from 'next/link';
import { useData } from '@context/Data';
import styles from './Companies.module.css';
import LinkButton from '@components/layout/LinkButton';

export default function Companies() {
  const { companies } = useData();

  return (
    <section className={styles.all_companies}>
      {companies.isLoading && <h2>Loading...</h2>}
      {!companies.isLoading && companies.data.length === 0 && (
        <h2>No companies</h2>
      )}
      {companies.data.length > 0 && (
        <>
          <h2>All companies</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Shift</th>
                <th className={styles.hide_on_mobile}>Website</th>
                <th className={styles.hide_on_mobile}>Code</th>
                <th>Budget/shift</th>
              </tr>
            </thead>
            <tbody>
              {companies.data.map((company) => (
                <tr key={company._id}>
                  <td className={styles.important}>
                    <Link href={`/admin/companies/${company._id}`}>
                      <a>{company.name}</a>
                    </Link>
                  </td>
                  <td className={styles.shift}>{company.shift}</td>
                  <td className={styles.hide_on_mobile}>{company.website}</td>
                  <td className={styles.hide_on_mobile}>{company.code}</td>
                  <td>${company.shiftBudget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <LinkButton linkText='Add company' href='/admin/companies/add-company' />
    </section>
  );
}
