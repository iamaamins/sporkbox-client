import { useAlert } from './Alert';
import { useRouter } from 'next/router';
import { axiosInstance, showErrorAlert } from '@utils/index';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  Admin,
  Customer,
  UserContext,
  CustomAxiosError,
  ContextProviderProps,
} from 'types';

// Create context
const UserContext = createContext({} as UserContext);

// Create hook
export const useUser = () => useContext(UserContext);

// Provider function
export default function UserProvider({ children }: ContextProviderProps) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  // Get user
  useEffect(() => {
    async function getUser() {
      try {
        // Fetch the data
        const response = await axiosInstance.get(`/users/me`, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        // Update state
        if (response.data.role === 'ADMIN') {
          setAdmin(response.data);
        } else {
          setCustomer(response.data);
        }
      } catch (err) {
        // Log error
        console.log(err);

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        // Remove loader
        setIsUserLoading(false);
      }
    }

    // Always run get user function
    getUser();
  }, [router.isReady]);

  // Check if the user is admin
  const isAdmin = admin?.role === 'ADMIN';

  // Check if the user is customer
  const isCustomer = customer?.role === 'CUSTOMER';

  return (
    <UserContext.Provider
      value={{
        admin,
        isAdmin,
        setAdmin,
        customer,
        isCustomer,
        setCustomer,
        isUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
