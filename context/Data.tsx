import axios from "axios";
import { useUser } from "./User";
import {
  IVendor,
  ICompany,
  IDataContext,
  IOrder,
  IContextProviderProps,
  IScheduledRestaurant,
} from "types";
import { useState, createContext, useContext, useEffect } from "react";

// Create context
const DataContext = createContext({} as IDataContext);

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }: IContextProviderProps) {
  const { isAdmin } = useUser();
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [scheduledRestaurants, setScheduledRestaurants] = useState<
    IScheduledRestaurant[]
  >([]);
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<IOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<IOrder[]>([]);

  // Create all orders
  useEffect(() => {
    setAllOrders([...activeOrders, ...deliveredOrders]);
  }, [activeOrders, deliveredOrders]);

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
        setActiveOrders(res.data);
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
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/scheduled`
        );

        // Update state
        setScheduledRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    // Call the function
    getGenericData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        allOrders,
        setCompanies,
        activeOrders,
        setActiveOrders,
        deliveredOrders,
        setDeliveredOrders,
        scheduledRestaurants,
        setScheduledRestaurants,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
