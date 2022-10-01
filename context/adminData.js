import axios from "axios";
import { useUser } from "./user";
import { API_URL } from "@utils/index";
import { useState, createContext, useContext, useEffect } from "react";

// Create context
const AdminDataContext = createContext();

// Create hook
export const useAdminData = () => useContext(AdminDataContext);

// Provider function
export default function AdminDataProvider({ children }) {
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
    <AdminDataContext.Provider value={{ restaurants, setRestaurants }}>
      {children}
    </AdminDataContext.Provider>
  );
}
