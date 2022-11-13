import { useUser } from "./User";
import {
  IOrder,
  IVendor,
  ICompany,
  IDataContext,
  ICustomerOrder,
  IContextProviderProps,
  IScheduledRestaurant,
  IUpcomingWeekRestaurant,
  ICustomerFavoriteItem,
  INextWeekBudgetAndDates,
} from "types";
import { useState, createContext, useContext, useEffect } from "react";
import { axiosInstance, convertDateToMS, formatNumberToUS } from "@utils/index";

// Create context
const DataContext = createContext({} as IDataContext);

// Create hook
export const useData = () => useContext(DataContext);

// Provider function
export default function DataProvider({ children }: IContextProviderProps) {
  // Hooks and states
  const { isAdmin, isCustomer, user } = useUser();
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [scheduledRestaurants, setScheduledRestaurants] = useState<
    IScheduledRestaurant[]
  >([]);
  const [upcomingWeekRestaurants, setUpcomingWeekRestaurants] = useState<
    IUpcomingWeekRestaurant[]
  >([]);
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [allActiveOrders, setAllActiveOrders] = useState<IOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<IOrder[]>([]);
  const [customerActiveOrders, setCustomerActiveOrders] = useState<
    ICustomerOrder[]
  >([]);
  const [customerDeliveredOrders, setCustomerDeliveredOrders] = useState<
    ICustomerOrder[]
  >([]);
  const [customerAllOrders, setCustomerAllOrders] = useState<ICustomerOrder[]>(
    []
  );
  const [customerFavoriteItems, setCustomerFavoriteItems] = useState<
    ICustomerFavoriteItem[]
  >([]);
  const [nextWeekBudgetAndDates, setNextWeekBudgetAndDates] = useState<
    INextWeekBudgetAndDates[]
  >([]);
  const [nextWeekDates, setNextWeekDates] = useState<number[]>([]);

  // Loading states
  const [
    isUpcomingWeekRestaurantsLoading,
    setIsUpcomingWeekRestaurantsLoading,
  ] = useState(true);
  const [isAllActiveOrdersLoading, setIsAllActiveOrdersLoading] =
    useState(true);
  const [isAllVendorsLoading, setIsAllVendorsLoading] = useState(true);
  const [isAllCompaniesLoading, setIsAllCompaniesLoading] = useState(true);
  const [isAllDeliveredOrdersLoading, setIsAllDeliveredOrdersLoading] =
    useState(true);
  const [isScheduledRestaurantsLoading, setIsScheduledRestaurantsLoading] =
    useState(true);
  const [isCustomerActiveOrdersLoading, setIsCustomerActiveOrdersLoading] =
    useState(true);
  const [
    isCustomerDeliveredOrdersLoading,
    setIsCustomerDeliveredOrdersLoading,
  ] = useState(true);
  const [isCustomerFavoriteItemsLoading, setIsCustomerFavoriteItemsLoading] =
    useState(true);

  // Get admin data
  useEffect(() => {
    // Get admin data
    async function getAdminData() {
      // Get active orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/active`);

        // Update state
        setAllActiveOrders(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsAllActiveOrdersLoading(false);
      }

      // Get 25 latest vendors
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/vendors/25`);

        // Update state
        setVendors(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsAllVendorsLoading(false);
      }

      // Get all companies
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/companies`);

        // Update state
        setCompanies(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsAllCompaniesLoading(false);
      }

      // Get 25 delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/delivered/25`);

        // Update state
        setDeliveredOrders(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsAllDeliveredOrdersLoading(false);
      }

      // Get scheduled restaurants
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/restaurants/scheduled`);

        // Update state
        setScheduledRestaurants(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsScheduledRestaurantsLoading(false);
      }
    }

    // Run the function if there is an admin
    if (isAdmin) {
      getAdminData();
    }
  }, [isAdmin]);

  // Create all orders
  useEffect(() => {
    setAllOrders([...allActiveOrders, ...deliveredOrders]);
  }, [allActiveOrders, deliveredOrders]);

  // Get customer data
  useEffect(() => {
    // Get customer data
    async function getCustomerData() {
      // Get upcoming week restaurants
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/restaurants/upcoming-week`);

        // Update state
        setUpcomingWeekRestaurants(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsUpcomingWeekRestaurantsLoading(false);
      }

      // Get all active orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/me/active`);

        // Update state
        setCustomerActiveOrders(response.data);
      } catch (err) {
        // Log error
        console.log(err);
      } finally {
        // Remove loader
        setIsCustomerActiveOrdersLoading(false);
      }

      // Get 25 latest delivered orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/me/delivered/10`);

        // Update state
        setCustomerDeliveredOrders(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsCustomerDeliveredOrdersLoading(false);
      }

      // Get favorite items
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/favorites/me`);

        // Update data
        setCustomerFavoriteItems(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsCustomerFavoriteItemsLoading(false);
      }
    }

    // Only run this function if there is a customer
    if (isCustomer) {
      getCustomerData();
    }
  }, [isCustomer]);

  // Create customer all orders
  useEffect(() => {
    setCustomerAllOrders([...customerActiveOrders, ...customerDeliveredOrders]);
  }, [customerActiveOrders, customerDeliveredOrders]);

  // Create next week's dates with upcoming weeks restaurant
  useEffect(() => {
    if (
      !isUpcomingWeekRestaurantsLoading &&
      upcomingWeekRestaurants.length > 0
    ) {
      setNextWeekDates(
        upcomingWeekRestaurants
          .map((upcomingWeekRestaurant) =>
            convertDateToMS(upcomingWeekRestaurant.scheduledOn)
          )
          .filter((date, index, dates) => dates.indexOf(date) === index)
      );
    }
  }, [upcomingWeekRestaurants]);

  // Create next week budget
  useEffect(() => {
    if (
      isCustomer &&
      nextWeekDates.length > 0 &&
      !isCustomerActiveOrdersLoading
    ) {
      // Set next week budgets
      setNextWeekBudgetAndDates(
        nextWeekDates.map((nextWeekDate) => {
          // Find the orders those match the date
          const activeOrders = customerActiveOrders.filter(
            (customerActiveOrder) =>
              convertDateToMS(customerActiveOrder.deliveryDate) === nextWeekDate
          );

          // If active orders are found on the date
          if (activeOrders.length > 0) {
            // Calculate the active orders total
            const activeOrdersTotal = activeOrders.reduce(
              (acc, order) => acc + order.item.total,
              0
            );

            // Return the date and company budget - active orders total
            return {
              nextWeekDate,
              budgetOnHand: formatNumberToUS(
                user?.company?.dailyBudget! - activeOrdersTotal
              ),
            };
          } else {
            // If no active orders are found with the
            // date then return the date and company budget
            return {
              nextWeekDate,
              budgetOnHand: user?.company?.dailyBudget!,
            };
          }
        })
      );
    }
  }, [isCustomer, customerActiveOrders, nextWeekDates]);

  console.log(nextWeekBudgetAndDates);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        allOrders,
        setCompanies,
        nextWeekDates,
        deliveredOrders,
        allActiveOrders,
        customerAllOrders,
        setAllActiveOrders,
        setDeliveredOrders,
        isAllVendorsLoading,
        customerActiveOrders,
        scheduledRestaurants,
        isAllCompaniesLoading,
        customerFavoriteItems,
        nextWeekBudgetAndDates,
        customerDeliveredOrders,
        upcomingWeekRestaurants,
        setCustomerActiveOrders,
        setScheduledRestaurants,
        isAllActiveOrdersLoading,
        setCustomerFavoriteItems,
        setCustomerDeliveredOrders,
        isAllDeliveredOrdersLoading,
        isCustomerActiveOrdersLoading,
        isScheduledRestaurantsLoading,
        isCustomerFavoriteItemsLoading,
        isCustomerDeliveredOrdersLoading,
        isUpcomingWeekRestaurantsLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
