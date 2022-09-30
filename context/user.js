import axios from "axios";
import { useRouter } from "next/router";
import { API_URL, getUser } from "@utils/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useLoader } from "./loader";

// Create context
const UserContext = createContext();

// Create hook
export const useUser = () => useContext(UserContext);

// Provider function
export default function UserProvider({ children }) {
  const router = useRouter();
  const { setIsLoading } = useLoader();
  const [user, setUser] = useState(null);

  // Check if the user is admin
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function getUser() {
      try {
        // Fetch the data
        const res = await axios.get(`${API_URL}/user/me`, {
          withCredentials: true,
        });

        // Update state
        setUser(res.data);

        // Remove the loader
        setIsLoading(false);
      } catch (err) {
        console.log(err);

        // Remove the loader
        setIsLoading(false);
      }
    }

    getUser();
  }, [router.isReady]);

  return (
    <UserContext.Provider value={{ setUser, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}
