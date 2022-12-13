import { useUser } from "./User";
import {
  IDataContext,
  ICustomerOrder,
  IContextProviderProps,
  IScheduledRestaurants,
  IAllUpcomingOrders,
  ICompanies,
  IVendors,
  IAllDeliveredOrders,
  ICustomerUpcomingOrders,
  ICustomerDeliveredOrders,
  IUpcomingWeekRestaurants,
  ICustomerFavoriteItems,
} from "types";
import { useState, createContext, useContext, useEffect } from "react";
import {
  axiosInstance,
  convertDateToMS,
  formatNumberToUS,
  createOrdersGroups,
} from "@utils/index";

// Create context
const DataContext = createContext({} as IDataContext);

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }: IContextProviderProps) {
  // Hooks and states
  const { isAdmin, isCustomer, user } = useUser();

  // Initial state
  const initialState = {
    data: [],
    isLoading: true,
  };

  const [allUpcomingOrders, setAllUpcomingOrders] =
    useState<IAllUpcomingOrders>(initialState);
  const [scheduledRestaurants, setScheduledRestaurants] =
    useState<IScheduledRestaurants>(initialState);
  const [companies, setCompanies] = useState<ICompanies>(initialState);
  const [vendors, setVendors] = useState<IVendors>(initialState);
  const [allDeliveredOrders, setAllDeliveredOrders] =
    useState<IAllDeliveredOrders>(initialState);
  const [customerUpcomingOrders, setCustomerUpcomingOrders] =
    useState<ICustomerUpcomingOrders>(initialState);
  const [customerDeliveredOrders, setCustomerDeliveredOrders] =
    useState<ICustomerDeliveredOrders>(initialState);
  const [upcomingWeekRestaurants, setUpcomingWeekRestaurants] =
    useState<IUpcomingWeekRestaurants>(initialState);
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

  // Next week dates
  const nextWeekDates =
    !upcomingWeekRestaurants.isLoading &&
    upcomingWeekRestaurants.data.length > 0
      ? upcomingWeekRestaurants.data
          .map((upcomingWeekRestaurant) =>
            convertDateToMS(upcomingWeekRestaurant.scheduledOn)
          )
          .filter((date, index, dates) => dates.indexOf(date) === index)
      : [];

  // Next week budget and dates
  const nextWeekBudgetAndDates =
    isCustomer && nextWeekDates.length > 0 && !customerUpcomingOrders.isLoading
      ? nextWeekDates.map((nextWeekDate) => {
          // Find the orders those match the date
          const upcomingOrders = customerUpcomingOrders.data.filter(
            (customerUpcomingOrder) =>
              convertDateToMS(customerUpcomingOrder.delivery.date) ===
              nextWeekDate
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
              nextWeekDate,
              budgetOnHand: formatNumberToUS(
                user?.company?.dailyBudget! - upcomingOrdersTotal
              ),
            };
          } else {
            // If no upcoming orders are found with the
            // date then return the date and company budget
            return {
              nextWeekDate,
              budgetOnHand: user?.company?.dailyBudget!,
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
        const response = await axiosInstance.get(`/orders/upcoming`);

        // Update state
        setAllUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setAllUpcomingOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get scheduled restaurants
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/restaurants/scheduled`);

        // Update state
        setScheduledRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setScheduledRestaurants((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get all companies
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/companies`);

        // Update state
        setCompanies({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setCompanies((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get 25 latest vendors
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/vendors/25`);

        // Update state
        setVendors({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setVendors((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get 25 delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/delivered/25`);

        // Update state
        setAllDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setAllDeliveredOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));
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
        const response = await axiosInstance.get(`/orders/me/upcoming`);

        // Update state
        setCustomerUpcomingOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);
        // Remove loader
        setCustomerUpcomingOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get 10 latest delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/me/delivered/10`);

        // Update state
        setCustomerDeliveredOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setCustomerDeliveredOrders((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get upcoming week restaurants
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/restaurants/upcoming-week`);

        // Update state
        setUpcomingWeekRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setUpcomingWeekRestaurants((currState) => ({
          ...currState,
          isLoading: false,
        }));
      }

      // Get favorite items
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/favorites/me`);

        // Update data
        setCustomerFavoriteItems({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
        // Remove loader
        setCustomerFavoriteItems((currState) => ({
          ...currState,
          isLoading: false,
        }));
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
        nextWeekDates,
        upcomingOrdersGroups,
        deliveredOrdersGroups,
        allDeliveredOrders,
        allUpcomingOrders,
        customerAllOrders,
        setAllUpcomingOrders,
        setAllDeliveredOrders,
        customerUpcomingOrders,
        scheduledRestaurants,
        customerFavoriteItems,
        nextWeekBudgetAndDates,
        customerDeliveredOrders,
        upcomingWeekRestaurants,
        setCustomerUpcomingOrders,
        setScheduledRestaurants,
        setCustomerFavoriteItems,
        setCustomerDeliveredOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
