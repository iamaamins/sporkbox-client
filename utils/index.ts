import axios from "axios";
import moment from "moment-timezone";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import {
  IVendor,
  IRestaurant,
  Groups,
  IVendors,
  ICustomerFavoriteItems,
  IOrder,
  IOrdersGroup,
} from "types";

// Current year
export const currentYear = new Date().getFullYear();

// Convert number
export const formatNumberToUS = (number: number) =>
  +number.toLocaleString("en-US");

// Format currency
export const formatCurrencyToUSD = (number: number) =>
  new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(number);

// Convert date to milliseconds
export const convertDateToMS = (date: string) => new Date(date).getTime();

// Convert date to string
export const convertDateToText = (date: Date | string | number): string =>
  new Date(date).toUTCString().split(" ").slice(0, 3).join(" ");

// Check if there is an admin
export function checkUser(
  isUserLoading: boolean,
  user: boolean,
  router: NextRouter
) {
  if (!isUserLoading && !user) {
    router.push("/login");
  }
}

// Update restaurants items
export function updateVendors(
  updatedData: IVendor | IRestaurant,
  setVendors: React.Dispatch<SetStateAction<IVendors>>
) {
  // Update the restaurants state
  setVendors((currState) => ({
    ...currState,
    data: currState.data.map((currVendor) => {
      if (currVendor._id === updatedData._id && "status" in updatedData) {
        return {
          ...currVendor,
          status: updatedData.status,
        };
      } else if (
        currVendor.restaurant._id === updatedData._id &&
        "items" in updatedData
      ) {
        return {
          ...currVendor,
          restaurant: updatedData,
        };
      } else {
        return currVendor;
      }
    }),
  }));
}

// Group items by property
export function groupBy<
  Key extends keyof Item,
  Item extends Record<Key, string>,
  ItemsName extends PropertyKey
>(
  key: Key,
  items: Item[],
  itemsName: ItemsName
): Groups<Item, Key, ItemsName>[] {
  // Crate groups with provided key
  const groupsObj = items.reduce<Record<string, Item[]>>((acc, curr) => {
    // Property to create group with
    const property: string = curr[key];

    // If property exists in acc then,
    // add the current item to the property array
    if (property in acc) {
      return { ...acc, [property]: [...acc[property], curr] };
    }

    // Else create a property and
    // add the current item to an array
    return { ...acc, [property]: [curr] };
  }, {});

  // Convert the object
  const groupsArr = Object.keys(groupsObj).map(
    (property) =>
      ({
        [key]: property,
        [itemsName]: groupsObj[property],
      } as Groups<Item, Key, ItemsName>)
  );

  return groupsArr;
}

// Get the UTC date
export const getDate = (date: number | string) => new Date(date).getUTCDate();

// Get the first letter of the UTC day
export const getDay = (date: number | string) =>
  new Date(date).toUTCString().split("").slice(0, 1);

// Handle remove from favorite
export async function handleRemoveFromFavorite(
  itemId: string,
  setCustomerFavoriteItems: React.Dispatch<
    SetStateAction<ICustomerFavoriteItems>
  >
) {
  try {
    // Make request to backend
    await axiosInstance.delete(`/favorites/${itemId}/remove`);

    // Update state
    setCustomerFavoriteItems((currState) => ({
      ...currState,
      data: currState.data.filter(
        (customerFavoriteItem) => customerFavoriteItem._id !== itemId
      ),
    }));
  } catch (err) {
    console.log(err);
  }
}

// Get future date in UTC as the restaurant
// schedule date and delivery date has no timezone
export function getFutureDate(dayToAdd: number) {
  // Today
  const today = new Date();

  // Day number of current week sunday
  const sunday = today.getUTCDate() - today.getUTCDay();

  // Get future date in MS
  const futureDate = today.setUTCDate(sunday + dayToAdd);

  // Get future date without hours in MS
  return new Date(futureDate).setUTCHours(0, 0, 0, 0);
}

// Get future dates in MS
const nextSaturdayUTCTimestamp = getFutureDate(6);
const nextWeekMondayUTCTimestamp = getFutureDate(8);
const followingWeekSaturdayUTCTimestamp = getFutureDate(12);
const followingWeekMondayUTCTimestamp = getFutureDate(15);

// Current timestamp
const now = Date.now();

// Check if isDST
const isDST = moment.tz(new Date(), "America/Los_Angeles").isDST();

// Los Angeles time zone offset
const timeZoneOffsetInMS = isDST ? 420 : 480 * 60000;

// Convert UTC timestamp to Los Angeles timestamp
const nextSaturdayLosAngelesTimestamp =
  nextSaturdayUTCTimestamp + timeZoneOffsetInMS;
const followingWeekSaturdayLosAngelesTimestamp =
  followingWeekSaturdayUTCTimestamp + timeZoneOffsetInMS;

// Filters
export const gte =
  now < nextSaturdayLosAngelesTimestamp
    ? nextWeekMondayUTCTimestamp
    : followingWeekMondayUTCTimestamp;
export const expiresIn =
  now < nextSaturdayLosAngelesTimestamp
    ? nextSaturdayLosAngelesTimestamp
    : followingWeekSaturdayLosAngelesTimestamp;

// Create text to slug
export const textToSlug = (text: string) =>
  text.toLowerCase().split(" ").join("-");

// Group orders by company name and delivery date
export const createOrdersGroups = (orders: IOrder[]) =>
  orders.reduce((acc: IOrdersGroup[], curr): IOrdersGroup[] => {
    if (
      !acc.some(
        (ordersGroup) =>
          ordersGroup.companyName === curr.companyName &&
          ordersGroup.deliveryDate === curr.deliveryDate
      )
    ) {
      return [
        ...acc,
        {
          orders: [curr],
          companyName: curr.companyName,
          deliveryDate: curr.deliveryDate,
          restaurants: [curr.restaurantName],
        },
      ] as IOrdersGroup[];
    } else {
      return acc.map((ordersGroup) => {
        if (
          ordersGroup.companyName === curr.companyName &&
          ordersGroup.deliveryDate === curr.deliveryDate
        ) {
          return {
            ...ordersGroup,
            orders: [...ordersGroup.orders, curr],
            restaurants: ordersGroup.restaurants.includes(curr.restaurantName)
              ? [...ordersGroup.restaurants]
              : [...ordersGroup.restaurants, curr.restaurantName],
          };
        } else {
          return ordersGroup;
        }
      }) as IOrdersGroup[];
    }
  }, []);

// Create axios instance
export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5100",
});

// http://localhost:5100
// https://api.araqo.com
// https://api.sporkbox.app
