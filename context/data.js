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

  useEffect(() => {
    async function getData() {
      // Get all restaurants
      try {
        const res = await axios.get(`${API_URL}/restaurant`, {
          withCredentials: true,
        });

        // Update state
        setRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    // Run the function if there is an admin
    if (isAdmin) {
      getData();
    }
  }, [isAdmin]);

  return (
    <DataContext.Provider value={{ restaurants, setRestaurants }}>
      {children}
    </DataContext.Provider>
  );
}
