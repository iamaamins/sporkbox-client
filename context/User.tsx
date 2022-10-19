import axios from "axios";
import { useRouter } from "next/router";
import { IContextProviderProps, IUser, IUserContext } from "types";
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const UserContext = createContext({} as IUserContext);

// Create hook
export const useUser = () => useContext(UserContext);

// Provider function
export default function UserProvider({ children }: IContextProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if the user is admin
  const isAdmin = user?.role === "ADMIN";

  // Check if the user is customer
  const isCustomer = user?.role === "CUSTOMER";

  // Check if the user is customer
  const isVendor = user?.role === "VENDOR";

  // Get user
  useEffect(() => {
    async function getUser() {
      try {
        // Fetch the data
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

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
    <UserContext.Provider
      value={{ isLoading, setUser, isAdmin, isVendor, isCustomer }}
    >
      {children}
    </UserContext.Provider>
  );
}
