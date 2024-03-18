import { useAlert } from './Alert';
import { useRouter } from 'next/router';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  IAdmin,
  IVendor,
  ICustomer,
  IUserContext,
  CustomAxiosError,
  IContextProviderProps,
} from 'types';

const UserContext = createContext({} as IUserContext);
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }: IContextProviderProps) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  // Get user
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosInstance.get(`/users/me`, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (response.data.role === 'ADMIN') setAdmin(response.data);
        if (response.data.role === 'VENDOR') setVendor(response.data);
        if (response.data.role === 'CUSTOMER') setCustomer(response.data);
      } catch (err) {
        console.log(err);
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setIsUserLoading(false);
      }
    }

    getUser();
  }, [router.isReady]);

  const isAdmin = admin?.role === 'ADMIN';
  const isVendor = vendor?.role === 'VENDOR';
  const isCustomer = customer?.role === 'CUSTOMER';

  return (
    <UserContext.Provider
      value={{
        admin,
        vendor,
        isAdmin,
        isVendor,
        setAdmin,
        customer,
        isCustomer,
        setVendor,
        setCustomer,
        isUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
