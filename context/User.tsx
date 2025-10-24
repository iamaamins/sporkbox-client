import { useAlert } from './Alert';
import { useRouter } from 'next/router';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Admin,
  Vendor,
  Customer,
  CustomAxiosError,
  ContextProviderProps,
} from 'types';

type UserContext = {
  admin: Admin | null;
  vendor: Vendor | null;
  customer: Customer | null;
  driver: Admin | null;
  isAdmin: boolean;
  isCustomer: boolean;
  isVendor: boolean;
  isDriver: boolean;
  isCompanyAdmin?: boolean;
  isUserLoading: boolean;
  setVendor: Dispatch<SetStateAction<Vendor | null>>;
  setAdmin: Dispatch<SetStateAction<Admin | null>>;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
  setDriver: Dispatch<SetStateAction<Admin | null>>;
};

const UserContext = createContext({} as UserContext);
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }: ContextProviderProps) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [driver, setDriver] = useState<Admin | null>(null);
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
        if (response.data.role === 'DRIVER') setDriver(response.data);
      } catch (err) {
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
  const isDriver = driver?.role === 'DRIVER';
  const isCompanyAdmin = customer?.isCompanyAdmin;

  return (
    <UserContext.Provider
      value={{
        admin,
        vendor,
        customer,
        driver,
        isAdmin,
        isVendor,
        isCustomer,
        isDriver,
        isCompanyAdmin,
        setAdmin,
        setVendor,
        setCustomer,
        setDriver,
        isUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
