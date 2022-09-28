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
    console.log(new Date("2022-10-05T02:02:17.135Z"));
    if (router.isReady) {
      const fetchAdmin = async () => {
        try {
          const res = await axios.get(`${API_URL}/admin/me`, {
            withCredentials: true,
          });

          console.log(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchAdmin();
    }
  }, [router]);

  return (
    <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
  );
}
