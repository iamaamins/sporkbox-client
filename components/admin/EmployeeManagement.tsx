import { useData } from '@context/Data';
import styles from './EmployeeManagement.module.css';
import { IoSearch } from 'react-icons/io5';
import { FormEvent, useEffect, useState } from 'react';
import { Customer } from 'types';
import Link from 'next/link';

export default function EmployeeManagement() {
  const { customers } = useData();
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState<Customer[]>([]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    setEmployees(
      customers.data.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          customer.email.toLocaleUpperCase().includes(query)
      )
    );
  }

  useEffect(() => {
    if (customers.data.length > 0 && !query)
      setEmployees(customers.data.slice(0, 10));
  }, [customers, query]);

  return (
    <section className={styles.container}>
      <h2>
        {customers.isLoading
          ? 'Loading...'
          : !customers.isLoading && customers.data.length === 0
          ? 'No customers found'
          : 'Employee management'}
      </h2>
      {employees.length > 0 && (
        <>
          <form onSubmit={handleSearch} className={styles.search}>
            <input
              type='text'
              value={query}
              placeholder='Search employees...'
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
            />
            <IoSearch className={styles.search_icon} size={20} />
          </form>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Company code</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td className={styles.important}>
                    <Link href={`/admin/dashboard/${employee._id}`}>
                      <a>
                        {employee.lastName} {employee.firstName}
                      </a>
                    </Link>
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.status}</td>
                  <td>{employee.companies[0].code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
