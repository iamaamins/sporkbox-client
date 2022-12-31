import { ICompanies, ICompany } from "./../types/index.d";
import axios from "axios";
import { Dispatch } from "react";
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
  IUser,
  ICustomers,
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
  updatedVendor: IVendor | IRestaurant,
  setVendors: Dispatch<SetStateAction<IVendors>>
) {
  // Update vendors
  setVendors((currState) => ({
    ...currState,
    data: currState.data.map((vendor) => {
      if (vendor._id === updatedVendor._id && "restaurant" in updatedVendor) {
        return {
          ...vendor,
          firstName: updatedVendor.firstName,
          lastName: updatedVendor.lastName,
          email: updatedVendor.email,
          status: updatedVendor.status,
          createdAt: updatedVendor.createdAt,
          restaurant: updatedVendor.restaurant,
        };
      } else if (
        vendor.restaurant._id === updatedVendor._id &&
        "items" in updatedVendor
      ) {
        return {
          ...vendor,
          restaurant: updatedVendor,
        };
      } else {
        return vendor;
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
    await axiosInstance.delete(`/favorites/${itemId}/remove-from-favorite`);

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
export const createSlug = (text: string) =>
  text.toLowerCase().split(" ").join("-");

// Group orders by company name and delivery date
export const createOrdersGroups = (orders: IOrder[]) =>
  orders.reduce((acc: IOrdersGroup[], curr): IOrdersGroup[] => {
    if (
      !acc.some(
        (ordersGroup) =>
          ordersGroup.companyName === curr.company.name &&
          ordersGroup.deliveryDate === curr.delivery.date
      )
    ) {
      return [
        ...acc,
        {
          orders: [curr],
          companyName: curr.company.name,
          deliveryDate: curr.delivery.date,
          restaurants: [curr.restaurant.name],
        },
      ] as IOrdersGroup[];
    } else {
      return acc.map((ordersGroup) => {
        if (
          ordersGroup.companyName === curr.company.name &&
          ordersGroup.deliveryDate === curr.delivery.date
        ) {
          return {
            ...ordersGroup,
            orders: [...ordersGroup.orders, curr],
            restaurants: ordersGroup.restaurants.includes(curr.restaurant.name)
              ? [...ordersGroup.restaurants]
              : [...ordersGroup.restaurants, curr.restaurant.name],
          };
        } else {
          return ordersGroup;
        }
      }) as IOrdersGroup[];
    }
  }, []);

// Sort users by last name
export const sortByLastName = (a: IUser, b: IUser) =>
  a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());

// Update customers
export function updateCustomers(
  updatedCustomer: IUser,
  setCustomers: Dispatch<SetStateAction<ICustomers>>
) {
  setCustomers((currState) => ({
    ...currState,
    data: currState.data.map((customer) => {
      if (customer._id === updatedCustomer._id) {
        return {
          ...customer,
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
          status: updatedCustomer.status,
        };
      } else {
        return customer;
      }
    }),
  }));
}

// Update companies
export function updateCompanies(
  updatedCompany: ICompany,
  setCompanies: Dispatch<SetStateAction<ICompanies>>
) {
  setCompanies((currState) => ({
    ...currState,
    data: !currState.data.some((company) => company._id === updatedCompany._id)
      ? [...currState.data, updatedCompany]
      : currState.data.map((company) => {
          if (company._id === updatedCompany._id) {
            return {
              ...company,
              name: updatedCompany.name,
              website: updatedCompany.website,
              address: updatedCompany.address,
              code: updatedCompany.code,
              status: updatedCompany.status,
              dailyBudget: updatedCompany.dailyBudget,
            };
          } else {
            return company;
          }
        }),
  }));
}

// Create axios instance
export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "https://api.sporkbox.octib.com",
});

// https://api.sporkbox.app
// https://api.sporkbox.octib.com
