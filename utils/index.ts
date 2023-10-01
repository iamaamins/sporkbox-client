import axios from 'axios';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { NextRouter } from 'next/router';
import {
  IOrder,
  IAlert,
  Groups,
  IVendor,
  IVendors,
  ICompany,
  ICustomer,
  ICustomers,
  ICompanies,
  IRestaurant,
  IOrdersGroup,
  CustomAxiosError,
  ICustomerFavoriteItems,
  DateTotal,
} from 'types';

// Current year
export const currentYear = new Date().getFullYear();

// Convert number
export const toUSNumber = (number: number) => +number.toLocaleString('en-US');

// Format currency
export const numberToUSD = (number: number) =>
  new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
  }).format(number);

// Convert date to milliseconds
export const dateToMS = (date: string) => new Date(date).getTime();

// Convert date to string
export const dateToText = (date: Date | string | number): string =>
  new Date(date).toUTCString().split(' ').slice(0, 3).join(' ');

// Check if there is an admin
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
  updatedVendor: IVendor | IRestaurant,
  setVendors: Dispatch<SetStateAction<IVendors>>
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
export const getDate = (date: number | string) =>
  new Date(date).getUTCDate().toString().padStart(2, '0');

// Get the first letter of the UTC day
export const getDay = (date: number | string) =>
  new Date(date).toUTCString().split('').slice(0, 2).join('').toUpperCase();

// Handle remove from favorite
export async function handleRemoveFromFavorite(
  setAlerts: Dispatch<SetStateAction<IAlert[]>>,
  itemId: string,
  setCustomerFavoriteItems: Dispatch<SetStateAction<ICustomerFavoriteItems>>
) {
  try {
    // Make request to backend
    await axiosInstance.delete(`/favorites/${itemId}/remove-from-favorite`);

    // Update state
    setCustomerFavoriteItems((prevState) => ({
      ...prevState,
      data: prevState.data.filter(
        (customerFavoriteItem) => customerFavoriteItem._id !== itemId
      ),
    }));

    // Show success alert
    showSuccessAlert('Favorite removed', setAlerts);
  } catch (err) {
    // Log error
    console.log(err);

    // Show error alert
    showErrorAlert(err as CustomAxiosError, setAlerts);
  }
}

// Create text to slug
export const createSlug = (text: string) =>
  text.toLowerCase().split(' ').join('-');

// Group orders by company name and delivery date
export const createOrdersGroups = (orders: IOrder[]) =>
  orders.reduce((acc: IOrdersGroup[], curr): IOrdersGroup[] => {
    if (
      !acc.some(
        (ordersGroup) =>
          ordersGroup.company._id === curr.company._id &&
          ordersGroup.deliveryDate === curr.delivery.date
      )
    ) {
      return [
        ...acc,
        {
          orders: [curr],
          company: {
            _id: curr.company._id,
            shift: curr.company.shift,
            name: curr.company.name,
          },
          customers: [curr.customer._id],
          deliveryDate: curr.delivery.date,
          restaurants: [curr.restaurant.name],
        },
      ];
    } else {
      return acc.map((ordersGroup) => {
        if (
          ordersGroup.company._id === curr.company._id &&
          ordersGroup.deliveryDate === curr.delivery.date
        ) {
          return {
            ...ordersGroup,
            orders: [...ordersGroup.orders, curr],
            customers: ordersGroup.customers.includes(curr.customer._id)
              ? ordersGroup.customers
              : [...ordersGroup.customers, curr.customer._id],
            restaurants: ordersGroup.restaurants.includes(curr.restaurant.name)
              ? ordersGroup.restaurants
              : [...ordersGroup.restaurants, curr.restaurant.name],
          };
        } else {
          return ordersGroup;
        }
      });
    }
  }, []);

// Sort users by last name
export const sortByLastName = (a: ICustomer, b: ICustomer) =>
  a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());

// Update customers
export function updateCustomers(
  updatedCustomer: ICustomer,
  setCustomers: Dispatch<SetStateAction<ICustomers>>
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

// Update companies
export function updateCompanies(
  updatedCompany: ICompany,
  setCompanies: Dispatch<SetStateAction<ICompanies>>
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

// Format image name
export const formatImageName = (name: string) =>
  name.length > 15
    ? `${name.slice(0, 10)}.${name.split('.')[name.split('.').length - 1]}`
    : name;

// Success alert
export function showSuccessAlert(
  message: string,
  setAlerts: Dispatch<SetStateAction<IAlert[]>>
) {
  // Update state
  setAlerts((prevState) => [...prevState, { message, type: 'success' }]);
}

// Error alert
export function showErrorAlert(
  err: CustomAxiosError | string,
  setAlerts: Dispatch<SetStateAction<IAlert[]>>
) {
  // Error type
  const type = 'failed';

  // Update state
  setAlerts((prevState) =>
    typeof err === 'string'
      ? [...prevState, { message: err, type }]
      : err.response
      ? [...prevState, { message: err.response.data.message, type }]
      : [...prevState, { message: "Something wen't wrong", type }]
  );
}

// Group identical orders
export const groupIdenticalOrders = (orders: IOrder[]) =>
  orders.reduce((acc: IOrder[], curr) => {
    if (
      !acc.some(
        (order) =>
          order.item._id === curr.item._id &&
          order.delivery.date === curr.delivery.date &&
          order.item.optionalAddons === curr.item.optionalAddons &&
          order.item.requiredAddons === curr.item.requiredAddons &&
          order.item.removedIngredients === curr.item.removedIngredients
      )
    ) {
      return [...acc, curr];
    } else {
      return acc.map((order) => {
        if (
          order.item._id === curr.item._id &&
          order.delivery.date === curr.delivery.date &&
          order.item.optionalAddons === curr.item.optionalAddons &&
          order.item.requiredAddons === curr.item.requiredAddons &&
          order.item.removedIngredients === curr.item.removedIngredients
        ) {
          return {
            ...order,
            item: {
              ...order.item,
              quantity: order.item.quantity + curr.item.quantity,
              total: order.item.total + curr.item.total,
            },
          };
        } else {
          return order;
        }
      });
    }
  }, []);

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

// Create axios instance
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

// Tag types
type Tags = (typeof tags)[number][];

// Split tags
export const splitTags = (tags: string) =>
  tags.split(',').map((tag) => tag.trim()) as Tags;

// Get addons total
export const getAddonsTotal = (addons: string[]) =>
  addons
    .map((addon) => addon.replace(/[\s$]/g, '').split('-'))
    .map(([name, price]) => +price)
    .reduce((acc, curr) => acc + curr, 0);

// Get total amount for each date
export function getDateTotal(details: DateTotal[]) {
  return details.reduce((acc, curr) => {
    if (!acc.some((detail) => detail.date === curr.date)) {
      return [...acc, curr];
    } else {
      return acc.map((detail) => {
        if (detail.date === curr.date) {
          return {
            ...detail,
            total: detail.total + curr.total,
          };
        } else {
          return detail;
        }
      });
    }
  }, [] as DateTotal[]);
}

// https://api.sporkbox.app
// https://api.sporkbox.octib.com
