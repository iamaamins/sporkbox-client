import axios from "axios";
import { useUser } from "./user";
import { API_URL } from "@utils/index";
import { useState, createContext, useContext, useEffect } from "react";

// Create context
const DataContext = createContext();

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }) {
  const { isAdmin } = useUser();
  const [restaurants, setRestaurants] = useState(null);
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    async function getAdminData() {
      // Get 20 latest restaurants
      try {
        const res = await axios.get(`${API_URL}/restaurant/20`, {
          withCredentials: true,
        });

        // Update state
        setRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }

      // Get all companies
      try {
        const res = await axios.get(`${API_URL}/company`, {
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

    // Run the function if there is an admin
    if (isAdmin) {
      getAdminData();
    }
  }, [isAdmin]);

  return (
    <DataContext.Provider
      value={{ restaurants, setRestaurants, companies, setCompanies }}
    >
      {children}
    </DataContext.Provider>
  );
}
