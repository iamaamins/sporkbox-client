import { useUser } from './User';
import { useAlert } from './Alert';
import {
  IVendors,
  ICompanies,
  ICustomers,
  IDataContext,
  ICustomerOrder,
  IDiscountCodes,
  CustomAxiosError,
  IAllUpcomingOrders,
  IAllDeliveredOrders,
  IUpcomingRestaurants,
  IScheduledRestaurants,
  IContextProviderProps,
  ICustomerFavoriteItems,
  ICustomerUpcomingOrders,
  ICustomerDeliveredOrders,
} from 'types';
import {
  axiosInstance,
  convertDateToMS,
  createOrdersGroups,
  showErrorAlert,
} from '@utils/index';
import { useState, createContext, useContext, useEffect } from 'react';

// Create context
const DataContext = createContext({} as IDataContext);

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }: IContextProviderProps) {
  // Initial state
  const initialState = {
    data: [],
    isLoading: true,
  };

  // Hooks
  const { setAlerts } = useAlert();
  const { isAdmin, isCustomer, customer } = useUser();
  const [allUpcomingOrders, setAllUpcomingOrders] =
    useState<IAllUpcomingOrders>(initialState);
  const [scheduledRestaurants, setScheduledRestaurants] =
    useState<IScheduledRestaurants>(initialState);
  const [companies, setCompanies] = useState<ICompanies>(initialState);
  const [vendors, setVendors] = useState<IVendors>(initialState);
  const [allDeliveredOrders, setAllDeliveredOrders] =
    useState<IAllDeliveredOrders>(initialState);
  const [customers, setCustomers] = useState<ICustomers>(initialState);
  const [customerUpcomingOrders, setCustomerUpcomingOrders] =
    useState<ICustomerUpcomingOrders>(initialState);
  const [customerDeliveredOrders, setCustomerDeliveredOrders] =
    useState<ICustomerDeliveredOrders>(initialState);
  const [upcomingRestaurants, setUpcomingRestaurants] =
    useState<IUpcomingRestaurants>(initialState);
  const [customerFavoriteItems, setCustomerFavoriteItems] =
    useState<ICustomerFavoriteItems>(initialState);
  const [discountCodes, setDiscountCodes] =
    useState<IDiscountCodes>(initialState);

  // All admin orders
  const allOrders = [...allUpcomingOrders.data, ...allDeliveredOrders.data];

  // All customer orders
  const customerAllOrders: ICustomerOrder[] = [
    ...customerUpcomingOrders.data,
    ...customerDeliveredOrders.data,
  ];

  // Group upcoming orders by company and delivery date
  const upcomingOrdersGroups = createOrdersGroups(allUpcomingOrders.data);

  // Group delivered orders by company and delivery date
  const deliveredOrdersGroups = createOrdersGroups(allDeliveredOrders.data);

  // Upcoming dates
  const upcomingDates =
    !upcomingRestaurants.isLoading && upcomingRestaurants.data.length > 0
      ? upcomingRestaurants.data
          .map((upcomingRestaurant) => convertDateToMS(upcomingRestaurant.date))
          .filter((date, index, dates) => dates.indexOf(date) === index)
      : [];

  // Get admin data
  useEffect(() => {
    async function getAdminData() {
      // Get all upcoming orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/all-upcoming-orders`);

        // Update state
        setAllUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setAllUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get scheduled restaurants
      try {
        // Make request to backend
        const response = await axiosInstance.get(
          `/restaurants/scheduled-restaurants`
        );

        // Update state
        setScheduledRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setScheduledRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get all companies
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/companies`);

        // Update state
        setCompanies({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setCompanies((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get 25 latest vendors
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/vendors/0`);

        // Update state
        setVendors({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setVendors((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get 25 delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(
          `/orders/all-delivered-orders/0`
        );

        // Update state
        setAllDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setAllDeliveredOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get all customers
      try {
        // Make request to backend
        const response = await axiosInstance.get('/customers');

        // Update state
        setCustomers({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setCustomers((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get discount codes
      try {
        setDiscountCodes({
          isLoading: false,
          data: [
            { code: 'dkghaad', value: 5, redeemability: 1, totalRedeem: 1 },
          ],
        });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setDiscountCodes((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    // Run the function if there is an admin
    if (isAdmin) {
      getAdminData();
    }
  }, [isAdmin]);

  // Get customer data
  useEffect(() => {
    async function getCustomerData() {
      // Get all upcoming orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/me/upcoming-orders`);

        // Update state
        setCustomerUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setCustomerUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get 10 latest delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(
          `/orders/me/delivered-orders/10`
        );

        // Update state
        setCustomerDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setCustomerDeliveredOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get favorite items
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/favorites/me`);

        // Update data
        setCustomerFavoriteItems({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setCustomerFavoriteItems((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    // Only run this function if there is a customer
    if (isCustomer) {
      getCustomerData();
    }
  }, [isCustomer]);

  // Get customer upcoming restaurants
  useEffect(() => {
    async function getUpcomingRestaurants() {
      try {
        // Make request to backend
        const response = await axiosInstance.get(
          `/restaurants/upcoming-restaurants`
        );

        // Update state
        setUpcomingRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);

        // Remove loader
        setUpcomingRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    // Only run this function if there is a customer
    if (isCustomer) {
      getUpcomingRestaurants();
    }
  }, [customer]);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        allOrders,
        setCompanies,
        customers,
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
        upcomingOrdersGroups,
        deliveredOrdersGroups,
        setAllDeliveredOrders,
        customerUpcomingOrders,
        customerDeliveredOrders,
        setScheduledRestaurants,
        setCustomerFavoriteItems,
        setCustomerUpcomingOrders,
        setCustomerDeliveredOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
