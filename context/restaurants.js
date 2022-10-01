import { API_URL } from "@utils/index";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, createContext, useContext, useEffect } from "react";

// Create context
const RestaurantsContext = createContext();

// Create hook
export const useRestaurants = () => useContext(RestaurantsContext);

// Provider function
export default function RestaurantsProvider({ children }) {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function getRestaurants() {
      try {
        // Get all restaurants
        const res = await axios.get(`${API_URL}/restaurant`, {
          withCredentials: true,
        });

        // Update state
        setRestaurants(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    getRestaurants();
  }, [router.isReady]);

  return (
    <RestaurantsContext.Provider value={{ restaurants, setRestaurants }}>
      {children}
    </RestaurantsContext.Provider>
  );
}
