import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { useEffect, useState } from 'react';
import UserOrders from './UserOrders';
import styles from './User.module.css';
import { CustomAxiosError, Company, Order, UserWithCompany } from 'types';
import {
  axiosInstance,
  showErrorAlert,
  groupIdenticalOrders,
  sortOrders,
} from '@lib/utils';

type UserWithOrders = {
  upcomingOrders: Order[];
  deliveredOrders: Order[];
  data: UserWithCompany | null;
};

export default function User() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, guests, allUpcomingOrders } = useData();
  const [user, setUser] = useState<UserWithOrders>({
    data: null,
    upcomingOrders: [],
    deliveredOrders: [],
  });

  async function getDeliveredOrders() {
    try {
      const response = await axiosInstance.get<Order[]>(
        `/orders/${router.query.user}/delivered`
      );
      setUser((prevState) => ({
        ...prevState,
        deliveredOrders: response.data.filter(
          (deliveredOrder) =>
            deliveredOrder.company._id === router.query.company
        ),
      }));
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  // Get customer data and upcoming orders
  useEffect(() => {
    if (
      router.isReady &&
      (customers.data.length > 0 || guests.data.length > 0)
    ) {
      const user = [...customers.data, ...guests.data].find(
        (user) => user._id === router.query.user
      );

      if (user) {
        const { companies, ...rest } = user;
        const customerWithCompany = {
          ...rest,
          company: companies.find(
            (company) => company._id === router.query.company
          ) as Company,
        };
        setUser((prevState) => ({
          ...prevState,
          data: customerWithCompany,
          upcomingOrders: allUpcomingOrders.data
            .filter(
              (upcomingOrder) =>
                upcomingOrder.customer._id === router.query.user &&
                upcomingOrder.company._id === router.query.company
            )
            .sort(sortOrders),
        }));
      }
    }
    if (router.isReady && user) getDeliveredOrders();
  }, [customers, guests, allUpcomingOrders, router.isReady]);

  return (
    <>
      <section className={styles.container}>
        <h2>
          {customers.isLoading
            ? 'Loading...'
            : !customers.isLoading && !user
            ? 'No customer found'
            : 'General'}
        </h2>
        {user.data && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Shift</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {user.data.firstName} {user.data.lastName}
                </td>
                <td>{user.data.company.name}</td>
                <td className={styles.shift}>{user.data.company.shift}</td>
                <td>
                  {user.data.company.address.addressLine2 ? (
                    <>
                      {user.data.company.address.addressLine1},{' '}
                      {user.data.company.address.addressLine2},{' '}
                      {user.data.company.address.city},{' '}
                      {user.data.company.address.state}{' '}
                      {user.data.company.address.zip}
                    </>
                  ) : (
                    <>
                      {user.data.company.address.addressLine1},{' '}
                      {user.data.company.address.city},{' '}
                      {user.data.company.address.state}{' '}
                      {user.data.company.address.zip}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
      {user.upcomingOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Upcoming orders</h2>
          <UserOrders orderGroups={groupIdenticalOrders(user.upcomingOrders)} />
        </section>
      )}
      {user.deliveredOrders.length > 0 && (
        <section className={styles.container}>
          <h2>Delivered orders</h2>
          <UserOrders
            orderGroups={groupIdenticalOrders(user.deliveredOrders)}
          />
        </section>
      )}
    </>
  );
}
