import { IAdmin, IContextProvider } from "../types";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "@utils/index";

const initialContext: IAdmin = {
  _id: "",
  name: "",
  email: "",
  token: "",
};

const AdminContext = createContext(initialContext);

export const useAdmin = () => useContext(AdminContext);

export default function AdminProvider({ children }: IContextProvider) {
  const router = useRouter();
  const [admin, setAdmin] = useState(initialContext);

  useEffect(() => {
    if (router.isReady) {
      const fetchAdmin = async () => {
        try {
          const res = await axios.get(`/api/admin/me`);

          return res;
        } catch (err) {
          console.log(err);
        }
      };

      const admin = fetchAdmin();

      console.log(admin);
    }
  }, [router]);

  return (
    <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
  );
}
