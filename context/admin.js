import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "@utils/index";
import { createContext, useContext, useEffect, useState } from "react";

const initialContext = {
  _id: "",
  name: "",
  email: "",
  token: "",
};

// Create context
const AdminContext = createContext(initialContext);

// Create hook
export const useAdmin = () => useContext(AdminContext);

// Provider function
export default function AdminProvider({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(initialContext);

  useEffect(() => {
    if (router.isReady) {
      async function getAdmin() {
        try {
          const res = await axios.get(`${API_URL}/admin/me`, {
            withCredentials: true,
          });

          // Update state
          setAdmin(res.data);
        } catch (err) {
          console.log(err);
        }
      }

      getAdmin();
    }
  }, [router]);

  return (
    <AdminContext.Provider value={{ admin }}>{children}</AdminContext.Provider>
  );
}
