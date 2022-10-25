import axios from "axios";
import { useUser } from "./User";
import {
  IOrder,
  IVendor,
  ICompany,
  IDataContext,
  ICustomerOrder,
  IContextProviderProps,
  IScheduledRestaurant,
  IUpcomingWeekRestaurant,
  ICustomerFavoriteItem,
} from "types";
import { useState, createContext, useContext, useEffect } from "react";
import { convertDateToMS, formatNumberToUS, gte } from "@utils/index";

// Create context
const DataContext = createContext({} as IDataContext);

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }: IContextProviderProps) {
  const { isAdmin, isCustomer } = useUser();
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [scheduledRestaurants, setScheduledRestaurants] = useState<
    IScheduledRestaurant[]
  >([]);
  const [upcomingWeekRestaurants, setUpcomingWeekRestaurants] = useState<
    IUpcomingWeekRestaurant[]
  >([]);
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [allActiveOrders, setAllActiveOrders] = useState<IOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<IOrder[]>([]);
  const [customerActiveOrders, setCustomerActiveOrders] = useState<
    ICustomerOrder[]
  >([]);
  const [customerDeliveredOrders, setCustomerDeliveredOrders] = useState<
    ICustomerOrder[]
  >([]);
  const [customerAllOrders, setCustomerAllOrders] = useState<ICustomerOrder[]>(
    []
  );
  const [customerFavoriteItems, setCustomerFavoriteItems] = useState<
    ICustomerFavoriteItem[]
  >([]);

  // Fetch generic data
  useEffect(() => {
    async function getGenericData() {
      // Get scheduled restaurants
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/upcoming-week`
        );

        // Update state
        setUpcomingWeekRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    // Call the function
    getGenericData();
  }, []);

  // Get admin data
  useEffect(() => {
    // Get admin data
    async function getAdminData() {
      // Get active orders
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/active`,
          {
            withCredentials: true,
          }
        );

        // Update state
        setAllActiveOrders(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get 25 latest vendors
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors/25`,
          {
            withCredentials: true,
          }
        );

        // Update state
        setVendors(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get all companies
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/companies`,
          {
            withCredentials: true,
          }
        );

        // Update state
        setCompanies(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get 25 delivered orders
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/delivered/25`,
          { withCredentials: true }
        );

        // Update state
        setDeliveredOrders(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get scheduled restaurants
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/scheduled`,
          { withCredentials: true }
        );

        // Update state
        setScheduledRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    // Run the function if there is an admin
    if (isAdmin) {
      getAdminData();
    }
  }, [isAdmin]);

  // Create all orders
  useEffect(() => {
    setAllOrders([...allActiveOrders, ...deliveredOrders]);
  }, [allActiveOrders, deliveredOrders]);

  // Get customer data
  useEffect(() => {
    // Get customer data
    async function getCustomerData() {
      // Get active orders
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/me/active`,
          {
            withCredentials: true,
          }
        );

        setCustomerActiveOrders(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get 25 latest delivered orders
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/me/delivered/25`,
          {
            withCredentials: true,
          }
        );

        // Update state
        setCustomerDeliveredOrders(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get favorite items
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/me`,
          {
            withCredentials: true,
          }
        );

        // Update data
        setCustomerFavoriteItems(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    // Only run this function if there is a customer
    if (isCustomer) {
      getCustomerData();
    }
  }, [isCustomer]);

  // Create customer all orders
  useEffect(() => {
    setCustomerAllOrders([...customerActiveOrders, ...customerDeliveredOrders]);
  }, [customerActiveOrders, customerDeliveredOrders]);

  // Calculate customer active orders total
  const customerActiveOrdersTotal = customerActiveOrders
    .filter(
      (customerActiveOrder) =>
        convertDateToMS(customerActiveOrder.deliveryDate) >= gte
    )
    .reduce((acc, order) => formatNumberToUS(acc + order.item.total), 0);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        allOrders,
        setCompanies,
        deliveredOrders,
        allActiveOrders,
        customerAllOrders,
        setAllActiveOrders,
        setDeliveredOrders,
        customerActiveOrders,
        scheduledRestaurants,
        customerFavoriteItems,
        customerDeliveredOrders,
        upcomingWeekRestaurants,
        setCustomerActiveOrders,
        setScheduledRestaurants,
        setCustomerFavoriteItems,
        customerActiveOrdersTotal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
