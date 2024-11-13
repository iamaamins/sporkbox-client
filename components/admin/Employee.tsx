import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import {
  axiosInstance,
  groupIdenticalOrders,
  showErrorAlert,
} from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomAxiosError, Customer, Order } from 'types';
import EmployeeOrders from './EmployeeOrders';
import styles from './Employee.module.css';

type EmployeeWithOrders = {
  data: Customer | null;
  upcomingOrders: Order[];
  deliveredOrders: Order[];
};

export default function Employee() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, allUpcomingOrders } = useData();
  const [employee, setEmployee] = useState<EmployeeWithOrders>({
    data: null,
    upcomingOrders: [],
    deliveredOrders: [],
  });

  async function getDeliveredOrders() {
    try {
      const response = await axiosInstance.get<Order[]>(
        `/orders/${router.query.employee}/all-delivered-orders`
      );
      setEmployee((prevState) => ({
        ...prevState,
        deliveredOrders: response.data,
      }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  // Get customer data and upcoming orders
  useEffect(() => {
    if (router.isReady && customers.data.length > 0) {
      const employee = customers.data.find(
        (customer) => customer._id === router.query.employee
      );

      if (employee) {
        setEmployee((prevState) => ({
          ...prevState,
          data: employee,
          upcomingOrders: allUpcomingOrders.data.filter(
            (upcomingOrder) =>
              upcomingOrder.customer._id === router.query.employee
          ),
        }));
      }
    }
    if (employee) getDeliveredOrders();
  }, [router.isReady, customers, allUpcomingOrders]);

  return (
    <>
      <section className={styles.container}>
        <h2>
          {customers.isLoading
            ? 'Loading...'
            : !customers.isLoading && !employee
            ? 'No employee found'
            : 'General'}
        </h2>
        {employee.data && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {employee.data.firstName} {employee.data.lastName}
                </td>
                <td>{employee.data.email}</td>
                <td>{employee.data.companies[0].code}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
      {employee.upcomingOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Upcoming orders</h2>
          <EmployeeOrders
            orders={groupIdenticalOrders(employee.upcomingOrders)}
          />
        </section>
      )}
      {employee.deliveredOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Delivered orders</h2>
          <EmployeeOrders
            orders={groupIdenticalOrders(employee.deliveredOrders)}
          />
        </section>
      )}
    </>
  );
}
