import { useUser } from './User';
import { useAlert } from './Alert';
import {
  Vendors,
  Companies,
  Customers,
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
  OrderGroup,
  DietaryTags,
  Guests,
  DriverOrders,
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
  companies: Companies;
  customers: Customers;
  guests: Guests;
  upcomingDates: number[];
  dietaryTags: DietaryTags;
  discountCodes: DiscountCodes;
  upcomingOrderGroups: OrderGroup[];
  deliveredOrderGroups: OrderGroup[];
  allUpcomingOrders: AllUpcomingOrders;
  allDeliveredOrders: AllDeliveredOrders;
  driverOrders: DriverOrders;
  upcomingRestaurants: UpcomingRestaurants;
  vendorUpcomingOrders: VendorUpcomingOrders;
  scheduledRestaurants: ScheduledRestaurants;
  customerFavoriteItems: CustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<Vendors>>;
  customerUpcomingOrders: CustomerUpcomingOrders;
  customerDeliveredOrders: CustomerDeliveredOrders;
  setCompanies: Dispatch<SetStateAction<Companies>>;
  setCustomers: Dispatch<SetStateAction<Customers>>;
  setGuests: Dispatch<SetStateAction<Guests>>;
  setVendorUpcomingOrders: Dispatch<SetStateAction<VendorUpcomingOrders>>;
  setDiscountCodes: Dispatch<SetStateAction<DiscountCodes>>;
  setAllUpcomingOrders: Dispatch<SetStateAction<AllUpcomingOrders>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<AllDeliveredOrders>>;
  setCustomerUpcomingOrders: Dispatch<SetStateAction<CustomerUpcomingOrders>>;
  setCustomerDeliveredOrders: Dispatch<SetStateAction<CustomerDeliveredOrders>>;
  setScheduledRestaurants: Dispatch<SetStateAction<ScheduledRestaurants>>;
  setCustomerFavoriteItems: Dispatch<SetStateAction<CustomerFavoriteItems>>;
  setDriverOrders: Dispatch<SetStateAction<DriverOrders>>;
};

const DataContext = createContext({} as DataContext);
export const useData = () => useContext(DataContext);

const initialState = { data: [], isLoading: true };

export default function DataProvider({ children }: ContextProviderProps) {
  const { setAlerts } = useAlert();
  const { isAdmin, isVendor, isCustomer, isDriver, customer } = useUser();
  const [allUpcomingOrders, setAllUpcomingOrders] =
    useState<AllUpcomingOrders>(initialState);
  const [scheduledRestaurants, setScheduledRestaurants] =
    useState<ScheduledRestaurants>(initialState);
  const [companies, setCompanies] = useState<Companies>(initialState);
  const [vendors, setVendors] = useState<Vendors>(initialState);
  const [allDeliveredOrders, setAllDeliveredOrders] =
    useState<AllDeliveredOrders>(initialState);
  const [customers, setCustomers] = useState<Customers>(initialState);
  const [guests, setGuests] = useState<Guests>(initialState);
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
  const [upcomingOrderGroups, setUpcomingOrderGroups] = useState<OrderGroup[]>(
    []
  );
  const [deliveredOrderGroups, setDeliveredOrderGroups] = useState<
    OrderGroup[]
  >([]);
  const [upcomingDates, setUpcomingDates] = useState<number[]>([]);
  const [driverOrders, setDriverOrders] = useState<DriverOrders>(initialState);

  async function getDietaryTags() {
    try {
      const response = await axiosInstance.get('/data/dietary-tags');
      setDietaryTags({ isLoading: false, data: response.data });
    } catch (err) {
      setDietaryTags((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  // Create data
  useEffect(() => {
    if (allUpcomingOrders.data.length) {
      setUpcomingOrderGroups(createOrderGroups(allUpcomingOrders.data));
    }
    if (allDeliveredOrders.data.length) {
      setDeliveredOrderGroups(createOrderGroups(allDeliveredOrders.data));
    }
    if (upcomingRestaurants.data.length) {
      setUpcomingDates(
        upcomingRestaurants.data
          .filter(
            (upcomingRestaurant) =>
              upcomingRestaurant.schedule.status === 'ACTIVE'
          )
          .map((upcomingRestaurant) =>
            dateToMS(upcomingRestaurant.schedule.date)
          )
          .filter((date, index, dates) => dates.indexOf(date) === index)
      );
    }
  }, [allUpcomingOrders, allDeliveredOrders, upcomingRestaurants]);

  // Get admin data
  useEffect(() => {
    async function getUpcomingOrders() {
      try {
        const response = await axiosInstance.get(`/orders/upcoming`);
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
        const response = await axiosInstance.get(`/restaurants/scheduled`);
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
        const response = await axiosInstance.get(`/orders/delivered/2500`);
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
    async function getGuests() {
      try {
        const response = await axiosInstance.get('/guests');
        setGuests({ isLoading: false, data: response.data });
      } catch (err) {
        setGuests((prevState) => ({
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
      getGuests();
      getDiscountCodes();
      getDietaryTags();
    }
  }, [isAdmin]);

  // Get customer's data
  useEffect(() => {
    async function getUpcomingOrders() {
      try {
        const response = await axiosInstance.get(`/orders/me/upcoming`);
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
        const response = await axiosInstance.get(`/orders/me/delivered/25`);
        setCustomerDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setCustomerDeliveredOrders((prevState) => ({
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
        const response = await axiosInstance.get(`/restaurants/me/upcoming`);
        setUpcomingRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
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
        const response = await axiosInstance.get(`/orders/vendor/upcoming`);
        setVendorUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setVendorUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (isVendor) getUpcomingOrders();
  }, [isVendor]);

  // Get drivers data
  useEffect(() => {
    async function getDriverOrders() {
      try {
        const response = await axiosInstance.get('/orders/driver/today');

        setDriverOrders({ isLoading: false, data: response.data });
      } catch (err) {
        setDriverOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (isDriver) getDriverOrders();
  }, [isDriver]);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        setCompanies,
        customers,
        setCustomers,
        guests,
        setGuests,
        dietaryTags,
        upcomingDates,
        discountCodes,
        setDiscountCodes,
        allUpcomingOrders,
        allDeliveredOrders,
        driverOrders,
        setAllDeliveredOrders,
        upcomingRestaurants,
        setAllUpcomingOrders,
        setDriverOrders,
        scheduledRestaurants,
        setScheduledRestaurants,
        customerFavoriteItems,
        setCustomerFavoriteItems,
        upcomingOrderGroups,
        deliveredOrderGroups,
        vendorUpcomingOrders,
        setVendorUpcomingOrders,
        customerUpcomingOrders,
        setCustomerUpcomingOrders,
        customerDeliveredOrders,
        setCustomerDeliveredOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
