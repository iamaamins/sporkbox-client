import { ICustomerWithOrders } from "types";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosInstance } from "@utils/index";
import CustomerOrders from "./CustomerOrders";
import styles from "@styles/admin/Customer.module.css";

export default function Customer() {
  // Hooks
  const router = useRouter();
  const { customers, allUpcomingOrders } = useData();
  const [customer, setCustomer] = useState<ICustomerWithOrders>({
    data: undefined,
    upcomingOrders: [],
    deliveredOrders: [],
  });

  useEffect(() => {
    // Get customer data and upcoming orders
    if (router.isReady && customers.data.length > 0) {
      // Update state
      setCustomer((currState) => ({
        ...currState,
        data: customers.data.find(
          (customer) =>
            customer.company?._id === router.query.company &&
            customer._id === router.query.customer
        ),
        upcomingOrders: allUpcomingOrders.data.filter(
          (upcomingOrder) =>
            upcomingOrder.customer._id === router.query.customer
        ),
      }));
    }

    // Get delivered orders when router is ready
    if (router.isReady) {
      getDeliveredOrders();
    }
  }, [router.isReady, customers, allUpcomingOrders]);

  // Get all delivered orders of a customer
  async function getDeliveredOrders() {
    try {
      // Make request to the backend
      const response = await axiosInstance.get(
        `/orders/${router.query.customer}/all-delivered-orders`
      );

      // Update state
      setCustomer((currState) => ({
        ...currState,
        deliveredOrders: response.data,
      }));
    } catch (err) {
      // Log error
      console.log(err);
    }
  }

  return (
    <section className={styles.customer}>
      {customers.isLoading && <h2>Loading...</h2>}

      {!customers.isLoading && !customer && <h2> No customer found</h2>}

      {customer.data && (
        <>
          <h2>General</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {customer.data.firstName} {customer.data.lastName}
                </td>
                <td>{customer.data.company?.name}</td>
                <td>{customer.data.company?.address}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Upcoming orders */}
      {customer.upcomingOrders.length > 0 && (
        <CustomerOrders
          orderStatus="Upcoming"
          orders={customer.upcomingOrders}
        />
      )}

      {/* Delivered orders */}
      {customer.deliveredOrders.length > 0 && (
        <CustomerOrders
          orderStatus="Delivered"
          orders={customer.deliveredOrders}
        />
      )}
    </section>
  );
}
