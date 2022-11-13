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
  INextWeekBudget,
} from "types";
import { useState, createContext, useContext, useEffect } from "react";
import {
  gte,
  axiosInstance,
  convertDateToMS,
  formatNumberToUS,
  groupBy,
} from "@utils/index";

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
  const [nextWeekBudget, setNextWeekBudget] = useState<INextWeekBudget[]>([]);

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

  // Fetch generic data
  useEffect(() => {
    async function getGenericData() {
      // Get scheduled restaurants
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
    }

    // Call the function
    getGenericData();
  }, []);

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

  // Create next week budget
  useEffect(() => {
    if (
      user &&
      !isCustomerActiveOrdersLoading &&
      !isUpcomingWeekRestaurantsLoading
    ) {
      // Next week dates
      const nextWeekDates = groupBy(
        "scheduledOn",
        upcomingWeekRestaurants,
        "restaurants"
      ).map((el) => convertDateToMS(el.scheduledOn));

      // Groups of active orders
      const activeOrdersGroups = groupBy(
        "deliveryDate",
        customerActiveOrders,
        "orders"
      );

      // Set next week budgets
      setNextWeekBudget(
        nextWeekDates.map((nextWeekDate) => {
          // Find a group that matches a date of next week
          const activeOrdersGroup = activeOrdersGroups.find(
            (activeOrdersGroup) =>
              convertDateToMS(activeOrdersGroup.deliveryDate) === nextWeekDate
          );

          // If a group is found
          if (activeOrdersGroup) {
            // Calculate the active orders total
            const activeOrdersTotal = activeOrdersGroup.orders.reduce(
              (acc, order) => acc + order.item.total,
              0
            );

            // Return the date and company budget - active orders total
            return {
              nextWeekDate,
              budgetLeft: formatNumberToUS(
                user.company?.dailyBudget! - activeOrdersTotal
              ),
            };
          } else {
            // If no group is found with a next week date
            // Return the date and company budget
            return {
              nextWeekDate,
              budgetLeft: user.company?.dailyBudget!,
            };
          }
        })
      );
    }
  }, [customerActiveOrders, upcomingWeekRestaurants, user]);

  // Calculate customer active orders total
  const customerActiveOrdersTotal = customerActiveOrders
    .filter(
      (customerActiveOrder) =>
        convertDateToMS(customerActiveOrder.deliveryDate) >= gte
    )
    .reduce((acc, order) => formatNumberToUS(acc + order.item.total), 0);

  return (
    <DataContext.Provider
      value={{
        vendors,
        setVendors,
        companies,
        allOrders,
        setCompanies,
        nextWeekBudget,
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
        customerDeliveredOrders,
        upcomingWeekRestaurants,
        setCustomerActiveOrders,
        setScheduledRestaurants,
        isAllActiveOrdersLoading,
        setCustomerFavoriteItems,
        customerActiveOrdersTotal,
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
