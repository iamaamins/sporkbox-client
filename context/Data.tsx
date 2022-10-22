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
} from "types";
import { useState, createContext, useContext, useEffect } from "react";

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

  // Create all orders
  useEffect(() => {
    setAllOrders([...allActiveOrders, ...deliveredOrders]);
  }, [allActiveOrders, deliveredOrders]);

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

      // Get 20 latest vendors
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors/20`,
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

      // Get 50 delivered orders
      try {
        // Make request to backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/50}`,
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
    }

    // Only run this function if there is a customer
    if (isCustomer) {
      getCustomerData();
    }
  }, [isCustomer]);

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
        setAllActiveOrders,
        setDeliveredOrders,
        customerActiveOrders,
        scheduledRestaurants,
        customerDeliveredOrders,
        upcomingWeekRestaurants,
        setScheduledRestaurants,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
