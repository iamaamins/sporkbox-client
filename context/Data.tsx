import { useUser } from "./User";
import {
  IOrder,
  IDataContext,
  IOrderGroup,
  ICustomerOrder,
  IContextProviderProps,
  IScheduledRestaurantsCtx,
  IAllActiveOrdersCtx,
  ICompaniesCtx,
  IVendorsCtx,
  IAllDeliveredOrdersCtx,
  ICustomerActiveOrdersCtx,
  ICustomerDeliveredOrdersCtx,
  IUpcomingWeekRestaurantsCtx,
  ICustomerFavoriteItemsCtx,
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

  // Initial state
  const initialState = {
    data: [],
    isLoading: true,
  };

  const [allActiveOrders, setAllActiveOrders] =
    useState<IAllActiveOrdersCtx>(initialState);
  const [scheduledRestaurants, setScheduledRestaurants] =
    useState<IScheduledRestaurantsCtx>(initialState);
  const [companies, setCompanies] = useState<ICompaniesCtx>(initialState);
  const [vendors, setVendors] = useState<IVendorsCtx>(initialState);
  const [upcomingWeekRestaurants, setUpcomingWeekRestaurants] =
    useState<IUpcomingWeekRestaurantsCtx>(initialState);
  const [allDeliveredOrders, setAllDeliveredOrders] =
    useState<IAllDeliveredOrdersCtx>(initialState);
  const [customerActiveOrders, setCustomerActiveOrders] =
    useState<ICustomerActiveOrdersCtx>(initialState);
  const [customerDeliveredOrders, setCustomerDeliveredOrders] =
    useState<ICustomerDeliveredOrdersCtx>(initialState);
  const [customerFavoriteItems, setCustomerFavoriteItems] =
    useState<ICustomerFavoriteItemsCtx>(initialState);

  // All admin orders
  const allOrders: IOrder[] = [
    ...allActiveOrders.data,
    ...allDeliveredOrders.data,
  ];

  // All customer orders
  const customerAllOrders: ICustomerOrder[] = [
    ...customerActiveOrders.data,
    ...customerDeliveredOrders.data,
  ];

  // Order groups
  const orderGroups = allActiveOrders.data.reduce(
    (orderGroups: IOrderGroup[], curr): IOrderGroup[] => {
      if (
        !orderGroups.some(
          (orderGroup) =>
            orderGroup.companyName === curr.companyName &&
            orderGroup.deliveryDate === curr.deliveryDate
        )
      ) {
        return [
          ...orderGroups,
          {
            orders: [curr],
            companyName: curr.companyName,
            deliveryDate: curr.deliveryDate,
            restaurants: [curr.restaurantName],
          },
        ] as IOrderGroup[];
      } else {
        return orderGroups.map((orderGroup) => {
          if (
            orderGroup.companyName === curr.companyName &&
            orderGroup.deliveryDate === curr.deliveryDate
          ) {
            return {
              ...orderGroup,
              orders: [...orderGroup.orders, curr],
              restaurants: orderGroup.restaurants.includes(curr.restaurantName)
                ? [...orderGroup.restaurants]
                : [...orderGroup.restaurants, curr.restaurantName],
            };
          } else {
            return orderGroup;
          }
        });
      }
    },
    []
  );

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
    isCustomer && nextWeekDates.length > 0 && !customerActiveOrders.isLoading
      ? nextWeekDates.map((nextWeekDate) => {
          // Find the orders those match the date
          const activeOrders = customerActiveOrders.data.filter(
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
      : [];

  // Get admin data
  useEffect(() => {
    // Get admin data
    async function getAdminData() {
      // Get active orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/active`);

        // Update state
        setAllActiveOrders({ isLoading: false, data: response.data });
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setAllActiveOrders((currState) => ({
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
      } finally {
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
      } finally {
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
      } finally {
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
      } finally {
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
      // Get all active orders
      try {
        // Make request to backend
        const response = await axiosInstance.get(`/orders/me/active`);

        // Update state
        setCustomerActiveOrders({ isLoading: false, data: response.data });
      } catch (err) {
        // Log error
        console.log(err);
      } finally {
        // Remove loader
        setCustomerActiveOrders((currState) => ({
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
      } finally {
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
      } finally {
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
      } finally {
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
        allDeliveredOrders,
        allActiveOrders,
        customerAllOrders,
        setAllActiveOrders,
        setAllDeliveredOrders,
        customerActiveOrders,
        scheduledRestaurants,
        customerFavoriteItems,
        nextWeekBudgetAndDates,
        customerDeliveredOrders,
        upcomingWeekRestaurants,
        setCustomerActiveOrders,
        setScheduledRestaurants,
        setCustomerFavoriteItems,
        setCustomerDeliveredOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
