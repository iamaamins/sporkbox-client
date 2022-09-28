import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "@utils/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useLoader } from "./loader";

// Create context
const AdminContext = createContext();

// Create hook
export const useAdmin = () => useContext(AdminContext);

// Provider function
export default function AdminProvider({ children }) {
  const { setLoading } = useLoader();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      async function getAdmin() {
        try {
          // Show the loader
          setLoading(true);

          // Fetch the data
          const res = await axios.get(`${API_URL}/admin/me`, {
            withCredentials: true,
          });

          // Update state
          setAdmin(res.data);

          // Remove the loader
          setLoading(false);
        } catch (err) {
          console.log(err);

          // Remove the loader
          setLoading(false);
        }
      }

      getAdmin();
    }
  }, [router]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
