import axios from "axios";
import { useUser } from "./user";
import { API_URL } from "@utils/index";
import { useRouter } from "next/router";
import { useState, createContext, useContext, useEffect } from "react";

// Create context
const DataContext = createContext();

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }) {
  const router = useRouter();
  const { isAdmin } = useUser();
  const [restaurants, setRestaurants] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [scheduledRestaurants, setScheduledRestaurants] = useState(null);

  useEffect(() => {
    // Get generic data
    async function getGenericData() {
      // Get scheduled restaurants
      try {
        // Make request to backend
        const res = await axios.get(`${API_URL}/restaurants/scheduled`);

        // Update state
        setScheduledRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    // Get admin data
    async function getAdminData() {
      // Get 20 latest restaurants
      try {
        const res = await axios.get(`${API_URL}/restaurants/20`, {
          withCredentials: true,
        });

        // Update state
        setRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get all companies
      try {
        const res = await axios.get(`${API_URL}/companies`, {
          withCredentials: true,
        });

        // Update state
        setCompanies(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get current orders

      // Get 20 latest orders
    }

    // Always run this function
    getGenericData();

    // Run the function if there is an admin
    if (isAdmin) {
      getAdminData();
    }
  }, [isAdmin, router.isReady]);

  return (
    <DataContext.Provider
      value={{
        restaurants,
        setRestaurants,
        companies,
        setCompanies,
        scheduledRestaurants,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
