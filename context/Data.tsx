import { useUser } from './User';
import { useAlert } from './Alert';
import {
  Vendors,
  Companies,
  Customers,
  CustomerOrder,
  DiscountCodes,
  CustomAxiosError,
  AllUpcomingOrders,
  AllDeliveredOrders,
  UpcomingRestaurants,
  ScheduledRestaurants,
  ContextProviderProps,
  CustomerFavoriteItems,
  CustomerUpcomingOrders,
  CustomerDeliveredOrders,
  VendorUpcomingOrders,
  Order,
  OrderGroup,
  DietaryTags,
} from 'types';
import {
  axiosInstance,
  dateToMS,
  createOrderGroups,
  showErrorAlert,
} from '@lib/utils';
import {
  useState,
  createContext,
  useContext,
  useEffect,
  SetStateAction,
  Dispatch,
} from 'react';

type DataContext = {
  vendors: Vendors;
  allOrders: Order[];
  companies: Companies;
  customers: Customers;
  upcomingDates: number[];
  dietaryTags: DietaryTags;
  discountCodes: DiscountCodes;
  customerAllOrders: CustomerOrder[];
  upcomingOrderGroups: OrderGroup[];
  deliveredOrderGroups: OrderGroup[];
  allUpcomingOrders: AllUpcomingOrders;
  allDeliveredOrders: AllDeliveredOrders;
  upcomingRestaurants: UpcomingRestaurants;
  vendorUpcomingOrders: VendorUpcomingOrders;
  scheduledRestaurants: ScheduledRestaurants;
  customerFavoriteItems: CustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<Vendors>>;
  customerUpcomingOrders: CustomerUpcomingOrders;
  customerDeliveredOrders: CustomerDeliveredOrders;
  setCompanies: Dispatch<SetStateAction<Companies>>;
  setCustomers: Dispatch<SetStateAction<Customers>>;
  setVendorUpcomingOrders: Dispatch<SetStateAction<VendorUpcomingOrders>>;
  setDiscountCodes: Dispatch<SetStateAction<DiscountCodes>>;
  setAllUpcomingOrders: Dispatch<SetStateAction<AllUpcomingOrders>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<AllDeliveredOrders>>;
  setCustomerUpcomingOrders: Dispatch<SetStateAction<CustomerUpcomingOrders>>;
  setCustomerDeliveredOrders: Dispatch<SetStateAction<CustomerDeliveredOrders>>;
  setScheduledRestaurants: Dispatch<SetStateAction<ScheduledRestaurants>>;
  setCustomerFavoriteItems: Dispatch<SetStateAction<CustomerFavoriteItems>>;
};

const DataContext = createContext({} as DataContext);
export const useData = () => useContext(DataContext);

const initialState = {
  data: [],
  isLoading: true,
};

export default function DataProvider({ children }: ContextProviderProps) {
  const { setAlerts } = useAlert();
  const { isAdmin, isVendor, isCustomer, customer } = useUser();
  const [allUpcomingOrders, setAllUpcomingOrders] =
    useState<AllUpcomingOrders>(initialState);
  const [scheduledRestaurants, setScheduledRestaurants] =
    useState<ScheduledRestaurants>(initialState);
  const [companies, setCompanies] = useState<Companies>(initialState);
  const [vendors, setVendors] = useState<Vendors>(initialState);
  const [allDeliveredOrders, setAllDeliveredOrders] =
    useState<AllDeliveredOrders>(initialState);
  const [customers, setCustomers] = useState<Customers>(initialState);
  const [customerUpcomingOrders, setCustomerUpcomingOrders] =
    useState<CustomerUpcomingOrders>(initialState);
  const [customerDeliveredOrders, setCustomerDeliveredOrders] =
    useState<CustomerDeliveredOrders>(initialState);
  const [upcomingRestaurants, setUpcomingRestaurants] =
    useState<UpcomingRestaurants>(initialState);
  const [customerFavoriteItems, setCustomerFavoriteItems] =
    useState<CustomerFavoriteItems>(initialState);
  const [discountCodes, setDiscountCodes] =
    useState<DiscountCodes>(initialState);
  const [vendorUpcomingOrders, setVendorUpcomingOrders] =
    useState<VendorUpcomingOrders>(initialState);
  const [dietaryTags, setDietaryTags] = useState<DietaryTags>(initialState);

  // All admin orders
  const allOrders = [...allUpcomingOrders.data, ...allDeliveredOrders.data];

  // All customer orders
  const customerAllOrders: CustomerOrder[] = [
    ...customerUpcomingOrders.data,
    ...customerDeliveredOrders.data,
  ];

  // Group upcoming orders by company and delivery date
  const upcomingOrderGroups = createOrderGroups(allUpcomingOrders.data);

  // Group delivered orders by company and delivery date
  const deliveredOrderGroups = createOrderGroups(allDeliveredOrders.data);

  // Get upcoming dates
  const upcomingDates =
    !upcomingRestaurants.isLoading && upcomingRestaurants.data.length > 0
      ? upcomingRestaurants.data
          .filter(
            (upcomingRestaurant) =>
              upcomingRestaurant.schedule.status === 'ACTIVE'
          )
          .map((upcomingRestaurant) =>
            dateToMS(upcomingRestaurant.schedule.date)
          )
          .filter((date, index, dates) => dates.indexOf(date) === index)
      : [];

  // Get admin data
  useEffect(() => {
    async function getUpcomingOrders() {
      try {
        const response = await axiosInstance.get(`/orders/all-upcoming-orders`);
        setAllUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setAllUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getScheduledRestaurants() {
      try {
        const response = await axiosInstance.get(
          `/restaurants/scheduled-restaurants`
        );
        setScheduledRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        setScheduledRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getCompanies() {
      try {
        const response = await axiosInstance.get(`/companies`);
        setCompanies({ isLoading: false, data: response.data });
      } catch (err) {
        setCompanies((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getVendors() {
      try {
        const response = await axiosInstance.get(`/vendors/0`);
        setVendors({ isLoading: false, data: response.data });
      } catch (err) {
        setVendors((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getDeliveredOrders() {
      try {
        const response = await axiosInstance.get(
          `/orders/all-delivered-orders/2500`
        );
        setAllDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setAllDeliveredOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getCustomers() {
      try {
        const response = await axiosInstance.get('/customers');
        setCustomers({ isLoading: false, data: response.data });
      } catch (err) {
        setCustomers((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getDiscountCodes() {
      try {
        const response = await axiosInstance.get('/discount-code');
        setDiscountCodes({
          isLoading: false,
          data: response.data,
        });
      } catch (err) {
        setDiscountCodes((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (isAdmin) {
      getUpcomingOrders();
      getScheduledRestaurants();
      getCompanies();
      getVendors();
      getDeliveredOrders();
      getCustomers();
      getDiscountCodes();
    }
  }, [isAdmin]);

  // Get customer's data
  useEffect(() => {
    async function getUpcomingOrders() {
      try {
        const response = await axiosInstance.get(`/orders/me/upcoming-orders`);
        setCustomerUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setCustomerUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getDeliveredOrders() {
      try {
        const response = await axiosInstance.get(
          `/orders/me/delivered-orders/25`
        );
        setCustomerDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setCustomerDeliveredOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getDietaryTags() {
      try {
        const response = await axiosInstance.get('/customers/dietary-tags');
        setDietaryTags({ isLoading: false, data: response.data });
      } catch (err) {
        setDietaryTags((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    async function getFavoriteItems() {
      try {
        const response = await axiosInstance.get(`/favorites/me`);
        setCustomerFavoriteItems({ isLoading: false, data: response.data });
      } catch (err) {
        setCustomerFavoriteItems((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (isCustomer) {
      getUpcomingOrders();
      getDeliveredOrders();
      getDietaryTags();
      getFavoriteItems();
    }
  }, [isCustomer]);

  // Get customer's upcoming restaurants
  useEffect(() => {
    async function getUpcomingRestaurants() {
      try {
        const response = await axiosInstance.get(
          `/restaurants/upcoming-restaurants`
        );
        setUpcomingRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setUpcomingRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (isCustomer) getUpcomingRestaurants();
  }, [customer]);

  // Get vendor's data
  useEffect(() => {
    async function getUpcomingOrders() {
      try {
        const response = await axiosInstance.get(
          `/orders/vendor/upcoming-orders`
        );
        setVendorUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setVendorUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (isVendor) getUpcomingOrders();
  }, [isVendor]);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        allOrders,
        setCompanies,
        customers,
        dietaryTags,
        setCustomers,
        upcomingDates,
        discountCodes,
        setDiscountCodes,
        allUpcomingOrders,
        customerAllOrders,
        allDeliveredOrders,
        upcomingRestaurants,
        setAllUpcomingOrders,
        scheduledRestaurants,
        customerFavoriteItems,
        upcomingOrderGroups,
        deliveredOrderGroups,
        vendorUpcomingOrders,
        setAllDeliveredOrders,
        customerUpcomingOrders,
        customerDeliveredOrders,
        setScheduledRestaurants,
        setVendorUpcomingOrders,
        setCustomerFavoriteItems,
        setCustomerUpcomingOrders,
        setCustomerDeliveredOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
