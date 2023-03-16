import { useUser } from "./User";
import { AxiosError } from "axios";
import { useAlert } from "./Alert";
import {
  IVendors,
  ICompanies,
  ICustomers,
  IAxiosError,
  IDataContext,
  ICustomerOrder,
  IAllUpcomingOrders,
  IAllDeliveredOrders,
  IUpcomingRestaurants,
  IScheduledRestaurants,
  IContextProviderProps,
  ICustomerFavoriteItems,
  ICustomerUpcomingOrders,
  ICustomerDeliveredOrders,
  ICustomer,
} from "types";
import {
  axiosInstance,
  convertDateToMS,
  formatNumberToUS,
  createOrdersGroups,
  showErrorAlert,
} from "@utils/index";
import { useState, createContext, useContext, useEffect } from "react";

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
  const { isAdmin, isCustomer, user } = useUser();
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

  // Upcoming dates and shifts
  const upcomingDatesAndShifts =
    !upcomingRestaurants.isLoading && upcomingRestaurants.data.length > 0
      ? upcomingRestaurants.data
          .map((upcomingRestaurant) => ({
            date: convertDateToMS(upcomingRestaurant.date),
            shift: upcomingRestaurant.company.shift,
          }))
          .filter(
            (dayAndShift, index, dayAndShifts) =>
              dayAndShifts.findIndex(
                (element) =>
                  element.date === dayAndShift.date &&
                  element.shift === dayAndShift.shift
              ) === index
          )
      : [];

  // Budget left on shifts
  const budgetLeftOnShifts =
    isCustomer &&
    upcomingDatesAndShifts.length > 0 &&
    !customerUpcomingOrders.isLoading
      ? upcomingDatesAndShifts.map((upcomingDateAndShift) => {
          // Find the orders those match the date
          const upcomingOrders = customerUpcomingOrders.data.filter(
            (customerUpcomingOrder) =>
              convertDateToMS(customerUpcomingOrder.delivery.date) ===
                upcomingDateAndShift.date &&
              customerUpcomingOrder.company.shift === upcomingDateAndShift.shift
          );

          // Find company
          const company = (user as ICustomer).companies.find(
            (company) => company.shift === upcomingDateAndShift.shift
          );

          // If upcoming orders are found on the date
          if (upcomingOrders.length > 0) {
            // Calculate the upcoming orders total
            const upcomingOrdersTotal = upcomingOrders.reduce(
              (acc, order) => acc + order.item.total,
              0
            );

            // Return the date and company budget - upcoming orders total
            return {
              ...upcomingDateAndShift,
              budgetOnHand: formatNumberToUS(
                company?.shiftBudget! - upcomingOrdersTotal
              ),
            };
          } else {
            // If no upcoming orders are found with the
            // date then return the date and company budget
            return {
              ...upcomingDateAndShift,
              budgetOnHand: company?.shiftBudget!,
            };
          }
        })
      : [];

  // Get admin data
  useEffect(() => {
    // Get admin data
    async function getAdminData() {
      // Get all upcoming orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/all-upcoming-orders`);

        // Update state
        setAllUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setAllUpcomingOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
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
        // Remove loader
        setScheduledRestaurants((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }

      // Get all companies
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/companies`);

        // Update state
        setCompanies({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setCompanies((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }

      // Get 25 latest vendors
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/vendors/25`);

        // Update state
        setVendors({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setVendors((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }

      // Get 25 delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(
          `/orders/all-delivered-orders/25`
        );

        // Update state
        setAllDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setAllDeliveredOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }

      // Get all customers
      try {
        // Make request to backend
        const response = await axiosInstance.get("/customers");

        // Update state
        setCustomers({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setCustomers((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }
    }

    // Run the function if there is an admin
    if (isAdmin) {
      getAdminData();
    }
  }, [isAdmin]);

  // Get customer data
  useEffect(() => {
    // Get customer data
    async function getCustomerData() {
      // Get all upcoming orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/me/upcoming-orders`);

        // Update state
        setCustomerUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setCustomerUpcomingOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
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
        // Remove loader
        setCustomerDeliveredOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }

      // Get upcoming week restaurants
      try {
        // Make request to backend
        const response = await axiosInstance.get(
          `/restaurants/upcoming-restaurants`
        );

        // Update state
        setUpcomingRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setUpcomingRestaurants((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }

      // Get favorite items
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/favorites/me`);

        // Update data
        setCustomerFavoriteItems({ isLoading: false, data: response.data });
      } catch (err) {
        // Remove loader
        setCustomerFavoriteItems((currState) => ({
          ...currState,
          isLoading: false,
        }));

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      }
    }

    // Only run this function if there is a customer
    if (isCustomer) {
      getCustomerData();
    }
  }, [isCustomer]);

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
        allUpcomingOrders,
        customerAllOrders,
        budgetLeftOnShifts,
        allDeliveredOrders,
        upcomingRestaurants,
        setAllUpcomingOrders,
        scheduledRestaurants,
        customerFavoriteItems,
        upcomingOrdersGroups,
        deliveredOrdersGroups,
        setAllDeliveredOrders,
        customerUpcomingOrders,
        upcomingDatesAndShifts,
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
