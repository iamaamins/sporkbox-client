import { IVendor, IRestaurant } from "types";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";

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
export const convertDateToMilliseconds = (date: string) =>
  new Date(date).getTime();

// Convert iso date to locale date string
export const convertDateToText = (date: string | number) =>
  new Date(date).toDateString().split(" ").slice(0, 3).join(" ");

// Check if any input field is empty
export const hasEmpty = (formData: object): boolean =>
  Object.values(formData).some((data) => data === "");

// Check if there is an admin
export function checkUser(
  isLoading: boolean,
  user: boolean,
  router: NextRouter
) {
  if (!isLoading && !user) {
    router.push("/login");
  }
}

// Update restaurants items
export function updateVendors(
  updatedData: any,
  setVendors: React.Dispatch<SetStateAction<IVendor[]>>
) {
  // Update the restaurants state
  setVendors((currVendors) =>
    currVendors.map((currVendor) => {
      if (currVendor._id === updatedData._id) {
        return {
          ...currVendor,
          status: updatedData.status,
        };
      } else if (currVendor.restaurant._id === updatedData._id) {
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

// Update scheduled restaurants
export function updateScheduledRestaurants(
  updatedData: any,
  setScheduledRestaurants: React.Dispatch<SetStateAction<IRestaurant[]>>
) {
  // Update scheduled restaurants state
  setScheduledRestaurants((currScheduledRestaurants) => {
    // If the restaurant isn't already
    // in the scheduled restaurants array
    if (
      !currScheduledRestaurants.some(
        (currScheduledRestaurant) =>
          currScheduledRestaurant._id === updatedData._id
      )
    ) {
      return [...currScheduledRestaurants, updatedData];

      // If the restaurant is already
      // in the scheduled restaurants array
    } else {
      return currScheduledRestaurants.map((currScheduledRestaurant) => {
        if (currScheduledRestaurant._id === updatedData._id) {
          return {
            ...currScheduledRestaurant,
            scheduledOn: updatedData.scheduledOn,
          };
        } else {
          return currScheduledRestaurant;
        }
      });
    }
  });
}

// Group items by property
export function groupBy(key: string, items: any[], itemsName: string): any[] {
  // Crate groups with provided key
  const groupsObj = items.reduce((acc, curr) => {
    // Property to create group with
    const property = curr[key];

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
  const groupsArr = Object.keys(groupsObj).map((property) => ({
    [key]: property,
    [itemsName]: groupsObj[property],
  }));

  return groupsArr;
}
