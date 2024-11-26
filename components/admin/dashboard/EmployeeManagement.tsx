import { useData } from '@context/Data';
import styles from './EmployeeManagement.module.css';
import { IoSearch } from 'react-icons/io5';
import { FormEvent, useEffect, useState } from 'react';
import { CustomAxiosError, Customer } from 'types';
import Link from 'next/link';
import { axiosInstance, dateToText, showErrorAlert } from '@lib/utils';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useUser } from '@context/User';
import { useAlert } from '@context/Alert';

export default function EmployeeManagement() {
  return (
    <section className={styles.container}>
      <h2>Employee management</h2>
      <Employees />
      <WeeklyOrderStat />
    </section>
  );
}

function Employees() {
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

  // Get 10 customers
  useEffect(() => {
    if (customers.data.length > 0 && !query)
      setEmployees(customers.data.slice(0, 10));
  }, [customers, query]);

  return (
    <div className={styles.employees}>
      <form onSubmit={handleSearch} className={styles.search}>
        <input
          type='text'
          value={query}
          placeholder='Search employees...'
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
        <IoSearch className={styles.search_icon} size={20} />
      </form>
      {customers.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : employees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className={styles.hide_on_mobile}>Company code</th>
              <th>Status</th>
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
                <td className={styles.hide_on_mobile}>
                  {employee.companies[0].code}
                </td>
                <td>{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.message}>No employee found</p>
      )}
    </div>
  );
}

type OrderStat = {
  isLoading: boolean;
  data: {
    date: string;
    count: number;
  }[];
};
function WeeklyOrderStat() {
  const today = new Date();
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const [currentDate, setCurrentDate] = useState(today);
  const [orderStat, setOrderStat] = useState<OrderStat>({
    isLoading: true,
    data: [],
  });

  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 6
  );
  const endDate = currentDate;

  const getDate = (date: Date, direction: 'next' | 'prev') =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      direction === 'next' ? date.getDate() + 7 : date.getDate() - 7
    );

  // Get weekly order stat
  useEffect(() => {
    async function getWeeklyOrderStat(start: Date, end: Date) {
      try {
        const response = await axiosInstance.get(
          `/orders/weekly-stat/${start}/${end}`
        );
        setOrderStat((prevState) => ({ ...prevState, data: response.data }));
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setOrderStat((prevState) => ({ ...prevState, isLoading: false }));
      }
    }
    if (isAdmin) getWeeklyOrderStat(startDate, endDate);
  }, [isAdmin, currentDate]);

  return (
    <div>
      <div className={styles.week_navigator}>
        <button
          onClick={() =>
            setCurrentDate((prevState) => getDate(prevState, 'prev'))
          }
        >
          <IoIosArrowRoundBack size={20} /> Prev
        </button>
        <p>
          {dateToText(startDate)} ~ {dateToText(endDate)}
        </p>
        <button
          disabled={getDate(currentDate, 'next') > today}
          onClick={() =>
            setCurrentDate((prevState) =>
              getDate(prevState, 'next') > today
                ? prevState
                : getDate(prevState, 'next')
            )
          }
        >
          Next <IoIosArrowRoundForward size={20} />
        </button>
      </div>
      {orderStat.isLoading ? (
        <p className={styles.message}>Loading....</p>
      ) : orderStat.data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer count</th>
            </tr>
          </thead>
          <tbody>
            {orderStat.data.map((el, index) => (
              <tr key={index}>
                <td>{dateToText(el.date)}</td>
                <td>{el.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.message}>No orders found</p>
      )}
    </div>
  );
}
