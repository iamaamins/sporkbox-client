import axios from "axios";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import {
  IVendor,
  IRestaurant,
  Groups,
  IFormData,
  ICustomerFavoriteItem,
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

// Convert date to slug
export const convertDateToMS = (date: string) => new Date(date).getTime();

// Convert iso date to locale date string
export const convertDateToText = (date: string | number) =>
  new Date(date).toUTCString().split(" ").slice(0, 3).join(" ");

// Check if any input field is empty
export const hasEmpty = (formData: IFormData): boolean =>
  Object.values(formData).some((data) => data === "");

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
  setVendors: React.Dispatch<SetStateAction<IVendor[]>>
) {
  // Update the restaurants state
  setVendors((currVendors) =>
    currVendors.map((currVendor) => {
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
    })
  );
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

// Get the date
export const getDate = (date: string) => new Date(date).getUTCDate();

// Get the first letter of the day
export const getDay = (date: string) =>
  new Date(date).toUTCString().split("").slice(0, 1);

// Handle remove from favorite
export async function handleRemoveFromFavorite(
  itemId: string,
  setCustomerFavoriteItems: React.Dispatch<
    SetStateAction<ICustomerFavoriteItem[]>
  >
) {
  try {
    // Make request to backend
    await axiosInstance.delete(`/favorites/${itemId}/remove`);

    // Update state
    setCustomerFavoriteItems(
      (currCustomerFavoriteItems: ICustomerFavoriteItem[]) =>
        currCustomerFavoriteItems.filter(
          (currCustomerFavoriteItem) => currCustomerFavoriteItem._id !== itemId
        )
    );
  } catch (err) {
    console.log(err);
  }
}

// Get future date
export function getFutureDate(dayToAdd: number) {
  // Today
  const today = new Date();

  // Day number of current week sunday
  const sunday = today.getDate() - today.getDay();

  // Get future date in MS
  const futureDate = today.setDate(sunday + dayToAdd);

  // Get future date without hours in MS
  const futureDateInMS = new Date(futureDate).setHours(0, 0, 0, 0);

  // Convert time zone difference in MS
  const timeZoneInMS = new Date(futureDateInMS).getTimezoneOffset() * 60000;

  // Return a future date - time zone in MS
  return futureDateInMS - timeZoneInMS;
}

// Get dates in iso string
// const today = new Date().getTime();
const nextSaturday = getFutureDate(6);
const nextMonday = getFutureDate(8);
const nextWeekSaturday = getFutureDate(13);
const followingMonday = getFutureDate(15);
const followingSaturday = getFutureDate(20);
const timeZoneInMs = new Date().getTimezoneOffset() * 60000;
const today = new Date().setHours(0, 0, 0, 0) - timeZoneInMs;

// Filters
export const gte = today < nextSaturday ? nextMonday : followingMonday;
export const lt = today < nextSaturday ? nextWeekSaturday : followingSaturday;

// Create axios instance
export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "https://sporkbytes.cyclic.app/api",
});

// http://localhost:5100/api
// https://sporkbytes.cyclic.app/api
