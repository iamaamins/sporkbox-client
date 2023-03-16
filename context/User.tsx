import { AxiosError } from "axios";
import { useAlert } from "./Alert";
import { useRouter } from "next/router";
import { axiosInstance, showErrorAlert } from "@utils/index";
import { createContext, useContext, useEffect, useState } from "react";
import {
  IAxiosError,
  IContextProviderProps,
  ICustomer,
  IUser,
  IUserContext,
} from "types";

// Create context
const UserContext = createContext({} as IUserContext);

// Create hook
export const useUser = () => useContext(UserContext);

// Provider function
export default function UserProvider({ children }: IContextProviderProps) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [user, setUser] = useState<IUser | ICustomer | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  // Get user
  useEffect(() => {
    async function getUser() {
      try {
        // Fetch the data
        const response = await axiosInstance.get(`/users/me`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        // Get data
        const user = response.data;

        // Update state
        setUser(
          response.data.role === "ADMIN" ? (user as IUser) : (user as ICustomer)
        );
      } catch (err) {
        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      } finally {
        // Remove loader
        setIsUserLoading(false);
      }
    }

    // Always run get user function
    getUser();
  }, [router.isReady]);

  // Check if the user is admin
  const isAdmin = user?.role === "ADMIN";

  // Check if the user is customer
  const isCustomer = user?.role === "CUSTOMER";

  return (
    <UserContext.Provider
      value={{ isUserLoading, user, setUser, isAdmin, isCustomer }}
    >
      {children}
    </UserContext.Provider>
  );
}
