import { useData } from '@context/Data';
import styles from './EmployeeManagement.module.css';
import { IoSearch } from 'react-icons/io5';
import { FormEvent, useEffect, useState } from 'react';
import { GoFoldUp } from 'react-icons/go';
import { Customer } from 'types';
import Link from 'next/link';

export default function EmployeeManagement() {
  const { customers } = useData();
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [showSearchField, setShowSearchField] = useState(false);
  const [query, setQuery] = useState('');

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    setCustomerData(
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
      setCustomerData(customers.data.slice(0, 10));
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
      {customerData.length > 0 && (
        <>
          <div className={styles.table_header}>
            <h3>Order history</h3>
            {showSearchField ? (
              <form onSubmit={handleSearch}>
                <input
                  type='text'
                  value={query}
                  placeholder='Search employee'
                  onChange={(e) => setQuery(e.target.value.toLowerCase())}
                />
                <GoFoldUp
                  className={styles.fold_icon}
                  size={20}
                  title='Close search field'
                  onClick={() => setShowSearchField(false)}
                />
              </form>
            ) : (
              <IoSearch
                className={styles.search_icon}
                size={20}
                title='Show search field'
                onClick={() => setShowSearchField(true)}
              />
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company code</th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((customer) => (
                <tr key={customer._id}>
                  <td className={styles.important}>
                    <Link href={`/admin/dashboard/${customer._id}`}>
                      <a>
                        {customer.lastName} {customer.firstName}
                      </a>
                    </Link>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.companies[0].code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
