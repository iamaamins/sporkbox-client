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
  const { setLoading } = useLoader();
  const [admin, setAdmin] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Get admin
    getUser(router, "admin", setAdmin, setLoading);

    // Get vendor

    // Get customer
  }, [router.isReady]);

  return (
    <UserContext.Provider
      value={{ admin, setAdmin, vendor, setVendor, customer, setCustomer }}
    >
      {children}
    </UserContext.Provider>
  );
}
