import axios from 'axios';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { NextRouter } from 'next/router';
import {
  Order,
  Alert,
  Vendor,
  Vendors,
  Company,
  Customer,
  Customers,
  Companies,
  Restaurant,
  OrderGroup,
  CustomAxiosError,
  CustomerFavoriteItems,
  DateTotal,
  VendorUpcomingOrder,
} from 'types';

export const currentYear = new Date().getFullYear();

export const toUSNumber = (number: number) => +number.toLocaleString('en-US');

// Format currency
export const numberToUSD = (number: number) =>
  new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
  }).format(number);

export const dateToMS = (date: string) => new Date(date).getTime();

export const dateToText = (date: Date | string | number): string =>
  new Date(date).toUTCString().split(' ').slice(0, 3).join(' ');

export function checkUser(
  isUserLoading: boolean,
  user: boolean,
  router: NextRouter
) {
  if (!isUserLoading && !user) {
    router.push('/login');
  }
}

// Update restaurants items
export function updateVendors(
  updatedVendor: Vendor | Restaurant,
  setVendors: Dispatch<SetStateAction<Vendors>>
) {
  // Update vendors
  setVendors((prevState) => ({
    ...prevState,
    data: prevState.data.map((vendor) => {
      if (vendor._id === updatedVendor._id && 'restaurant' in updatedVendor) {
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
        'items' in updatedVendor
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

export const getDate = (date: number | string) =>
  new Date(date).getUTCDate().toString().padStart(2, '0');

export const getDay = (date: number | string) =>
  new Date(date).toUTCString().split('').slice(0, 2).join('').toUpperCase();

export async function handleRemoveFromFavorite(
  setAlerts: Dispatch<SetStateAction<Alert[]>>,
  itemId: string,
  setCustomerFavoriteItems: Dispatch<SetStateAction<CustomerFavoriteItems>>
) {
  try {
    await axiosInstance.delete(`/favorites/${itemId}/remove-from-favorite`);
    setCustomerFavoriteItems((prevState) => ({
      ...prevState,
      data: prevState.data.filter(
        (customerFavoriteItem) => customerFavoriteItem._id !== itemId
      ),
    }));
    showSuccessAlert('Favorite removed', setAlerts);
  } catch (err) {
    console.log(err);
    showErrorAlert(err as CustomAxiosError, setAlerts);
  }
}

export const createSlug = (text: string) =>
  text.toLowerCase().split(' ').join('-');

// Group orders by company and delivery date
export function createOrderGroups(orders: Order[]) {
  const groupMap: Record<string, OrderGroup> = {};
  for (const order of orders) {
    const key = order.company.code + order.delivery.date;
    if (!groupMap[key]) {
      groupMap[key] = {
        orders: [order],
        company: {
          _id: order.company._id,
          shift: order.company.shift,
          name: order.company.name,
          code: order.company.code,
        },
        customers: [order.customer._id],
        deliveryDate: order.delivery.date,
        restaurants: [order.restaurant.name],
      };
    } else {
      groupMap[key].orders.push(order);
      if (!groupMap[key].customers.includes(order.customer._id))
        groupMap[key].customers.push(order.customer._id);
      if (!groupMap[key].restaurants.includes(order.restaurant.name))
        groupMap[key].restaurants.push(order.restaurant.name);
    }
  }
  return Object.values(groupMap);
}

export const sortByLastName = (a: Customer, b: Customer) =>
  a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());

export function updateCustomers(
  updatedCustomer: Customer,
  setCustomers: Dispatch<SetStateAction<Customers>>
) {
  setCustomers((prevState) => ({
    ...prevState,
    data: prevState.data.map((customer) => {
      if (customer._id === updatedCustomer._id) {
        return {
          ...customer,
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
          status: updatedCustomer.status,
          companies: updatedCustomer.companies,
        };
      } else {
        return customer;
      }
    }),
  }));
}

export function updateCompanies(
  updatedCompany: Company,
  setCompanies: Dispatch<SetStateAction<Companies>>
) {
  setCompanies((prevState) => ({
    ...prevState,
    data: !prevState.data.some((company) => company._id === updatedCompany._id)
      ? [...prevState.data, updatedCompany]
      : prevState.data.map((company) => {
          if (company._id === updatedCompany._id) {
            return {
              ...company,
              name: updatedCompany.name,
              code: updatedCompany.code,
              shift: updatedCompany.shift,
              status: updatedCompany.status,
              website: updatedCompany.website,
              address: updatedCompany.address,
              shiftBudget: updatedCompany.shiftBudget,
            };
          } else {
            return company;
          }
        }),
  }));
}

export const formatImageName = (name: string) =>
  name.length > 15
    ? `${name.slice(0, 10)}.${name.split('.')[name.split('.').length - 1]}`
    : name;

export function showSuccessAlert(
  message: string,
  setAlerts: Dispatch<SetStateAction<Alert[]>>
) {
  setAlerts((prevState) => [...prevState, { message, type: 'success' }]);
}

export function showErrorAlert(
  err: CustomAxiosError | string,
  setAlerts: Dispatch<SetStateAction<Alert[]>>
) {
  const type = 'failed';
  setAlerts((prevState) =>
    typeof err === 'string'
      ? [...prevState, { message: err, type }]
      : err.response
      ? [...prevState, { message: err.response.data.message, type }]
      : [...prevState, { message: "Something wen't wrong", type }]
  );
}

export function groupIdenticalOrdersAndSort<
  T extends Order | VendorUpcomingOrder
>(orders: T[]): T[] {
  const orderMap: Record<string, T> = {};
  for (const order of orders) {
    const key =
      order.company._id +
      order.delivery.date +
      order.item._id +
      order.item.optionalAddons +
      order.item.requiredAddons +
      order.item.removedIngredients;

    if (!orderMap[key]) {
      orderMap[key] = structuredClone(order);
    } else {
      orderMap[key].item.quantity += order.item.quantity;
      if ('total' in order.item && 'total' in orderMap[key].item)
        (orderMap[key] as Order).item.total += (order as Order).item.total;
    }
  }
  return Object.values(orderMap).sort((a, b) =>
    a.item.name.localeCompare(b.item.name)
  );
}

// Format addable ingredients
export const formatAddons = (ingredients: string) =>
  ingredients
    .split(',')
    .map((ingredient) => ingredient.trim())
    .map((ingredient) =>
      ingredient.split('-').map((ingredient) => ingredient.trim())
    )
    .map((ingredient) =>
      +ingredient[1] > 0
        ? `${ingredient[0]} - $${ingredient[1]}`
        : ingredient[0]
    );

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Dietary tags
export const tags = [
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Nut-Free',
  'Soy-Free',
  'Dairy-Free',
  'Contains Nuts',
  'Contains Soy',
  'Enjoy Later',
  'Pork-Free',
  'Contains Shellfish',
] as const;

type Tags = (typeof tags)[number][];

export const splitTags = (tags: string) =>
  tags.split(',').map((tag) => tag.trim()) as Tags;

export const getAddonsTotal = (addons: string[]) =>
  addons
    .map((addon) => addon.replace(/[\s$]/g, '').split('-'))
    .map(([name, price]) => +price)
    .filter((price) => !isNaN(price))
    .reduce((acc, curr) => acc + curr, 0);

// Get total amount for each date
export function getDateTotal(details: DateTotal[]) {
  const dateTotalMap: Record<string, DateTotal> = {};
  for (const detail of details) {
    const key = detail.date;
    if (!dateTotalMap[key]) {
      dateTotalMap[key] = structuredClone(detail);
    } else {
      dateTotalMap[key].total += detail.total;
    }
  }
  return Object.values(dateTotalMap);
}

export function categorizeLastName(lastName: string) {
  const initial = lastName[0].toLowerCase();
  if (initial >= 'a' && initial <= 'f') return 'A-F';
  if (initial >= 'g' && initial <= 'l') return 'G-L';
  if (initial >= 'm' && initial <= 'r') return 'M-R';
  if (initial >= 's' && initial <= 'z') return 'S-Z';
}

export function getAddonIngredients(addons: string | undefined) {
  if (!addons) return '';

  const addonsArr = addons.split(',');
  const ingredients = [];
  for (const addon of addonsArr) {
    const ingredient = addon.split('-')[0].trim();
    ingredients.push(ingredient);
  }
  return ingredients.join(', ');
}
