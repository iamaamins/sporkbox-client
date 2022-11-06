import { useRouter } from "next/router";
import { axiosInstance } from "@utils/index";
import { IContextProviderProps, IUser, IUserContext } from "types";
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const UserContext = createContext({} as IUserContext);

// Create hook
export const useUser = () => useContext(UserContext);

// Provider function
export default function UserProvider({ children }: IContextProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
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

        // Update state
        setUser(response.data);
      } catch (err) {
        console.log(err);
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

  // Check if the user is customer
  const isVendor = user?.role === "VENDOR";

  return (
    <UserContext.Provider
      value={{ isUserLoading, user, setUser, isAdmin, isVendor, isCustomer }}
    >
      {children}
    </UserContext.Provider>
  );
}
