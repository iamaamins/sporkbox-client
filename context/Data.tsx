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
  IVendorUpcomingOrders,
} from 'types';
import {
  axiosInstance,
  dateToMS,
  createOrdersGroups,
  showErrorAlert,
} from '@lib/utils';
import { useState, createContext, useContext, useEffect } from 'react';

const DataContext = createContext({} as IDataContext);
export const useData = () => useContext(DataContext);

export default function DataProvider({ children }: IContextProviderProps) {
  const initialState = {
    data: [],
    isLoading: true,
  };

  const { setAlerts } = useAlert();
  const { isAdmin, isVendor, isCustomer, customer } = useUser();
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
  const [vendorUpcomingOrders, setVendorUpcomingOrders] =
    useState<IVendorUpcomingOrders>(initialState);

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

  const upcomingDates =
    !upcomingRestaurants.isLoading && upcomingRestaurants.data.length > 0
      ? upcomingRestaurants.data
          .map((upcomingRestaurant) => dateToMS(upcomingRestaurant.date))
          .filter((date, index, dates) => dates.indexOf(date) === index)
      : [];

  // Get admin data
  useEffect(() => {
    async function getAdminData() {
      // Get upcoming orders
      try {
        const response = await axiosInstance.get(`/orders/all-upcoming-orders`);
        setAllUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setAllUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get scheduled restaurants
      try {
        const response = await axiosInstance.get(
          `/restaurants/scheduled-restaurants`
        );
        setScheduledRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setScheduledRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get all companies
      try {
        const response = await axiosInstance.get(`/companies`);
        setCompanies({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setCompanies((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get 25 latest vendors
      try {
        const response = await axiosInstance.get(`/vendors/0`);
        setVendors({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setVendors((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get 2500 delivered orders
      try {
        const response = await axiosInstance.get(
          `/orders/all-delivered-orders/2500`
        );
        setAllDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setAllDeliveredOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get all customers
      try {
        const response = await axiosInstance.get('/customers');
        setCustomers({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setCustomers((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get discount codes
      try {
        const response = await axiosInstance.get('/discount-code');
        setDiscountCodes({
          isLoading: false,
          data: response.data,
        });
      } catch (err) {
        console.log(err);
        setDiscountCodes((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (isAdmin) getAdminData();
  }, [isAdmin]);

  // Get customer data
  useEffect(() => {
    async function getCustomerData() {
      // Get all upcoming orders
      try {
        const response = await axiosInstance.get(`/orders/me/upcoming-orders`);
        setCustomerUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setCustomerUpcomingOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get 10 latest delivered orders
      try {
        const response = await axiosInstance.get(
          `/orders/me/delivered-orders/10`
        );
        setCustomerDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setCustomerDeliveredOrders((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }

      // Get favorite items
      try {
        const response = await axiosInstance.get(`/favorites/me`);
        setCustomerFavoriteItems({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        setCustomerFavoriteItems((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (isCustomer) getCustomerData();
  }, [isCustomer]);

  // Get customer upcoming restaurants
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
    async function getVendorData() {
      // Get all upcoming orders
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
    if (isVendor) getVendorData();
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
