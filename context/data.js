import axios from "axios";
import { useUser } from "./User";
import { useState, createContext, useContext, useEffect } from "react";

// Create context
const DataContext = createContext();

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }) {
  const { isAdmin } = useUser();
  const [vendors, setVendors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [scheduledRestaurants, setScheduledRestaurants] = useState([]);

  // Get admin data
  useEffect(() => {
    // Get admin data
    async function getAdminData() {
      // Get 20 latest vendors
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/20`,
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

      // Get current orders

      // Get 20 latest orders
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
        setCompanies,
        scheduledRestaurants,
        setScheduledRestaurants,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
