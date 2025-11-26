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
  Companies,
  Restaurant,
  OrderGroup,
  CustomAxiosError,
  CustomerFavoriteItems,
  DateTotal,
  VendorUpcomingOrder,
  IdenticalOrderGroup,
  Guest,
  CustomerOrder,
  CartItem,
  UpcomingRestaurant,
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
  isUser: boolean,
  router: NextRouter
) {
  if (!isUserLoading && !isUser) router.push('/login');
}

export function checkCompanyAdmin(
  isUserLoading: boolean,
  user: Customer | null,
  router: NextRouter
) {
  if (!isUserLoading && !user) router.push('/login');
  if (user && !user.isCompanyAdmin) router.push('/dashboard');
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
  favoriteId: string,
  setCustomerFavoriteItems: Dispatch<SetStateAction<CustomerFavoriteItems>>
) {
  try {
    await axiosInstance.delete(`/favorites/${favoriteId}/remove`);
    setCustomerFavoriteItems((prevState) => ({
      ...prevState,
      data: prevState.data.filter(
        (customerFavoriteItem) => customerFavoriteItem._id !== favoriteId
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
    const key = `${order.delivery.date}-${order.company.code}`;
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
              slackChannel: updatedCompany.slackChannel,
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

export function groupIdenticalOrders(orders: Order[]): IdenticalOrderGroup[] {
  const orderMap: Record<string, IdenticalOrderGroup> = {};
  for (const order of orders) {
    const key =
      order.delivery.date +
      order.restaurant._id +
      order.item._id +
      order.item.requiredAddonsOne +
      order.item.requiredAddonsTwo +
      order.item.optionalAddons +
      order.item.removedIngredients;

    if (!orderMap[key]) {
      orderMap[key] = {
        company: {
          shift: order.company.shift,
        },
        restaurant: {
          name: order.restaurant.name,
        },
        delivery: {
          date: order.delivery.date,
        },
        item: {
          name: order.item.name,
          requiredAddonsOne: order.item.requiredAddonsOne,
          requiredAddonsTwo: order.item.requiredAddonsTwo,
          optionalAddons: order.item.optionalAddons,
          removedIngredients: order.item.removedIngredients,
        },
        total: order.item.total,
        quantity: order.item.quantity,
      };
    } else {
      orderMap[key].total += order.item.total;
      orderMap[key].quantity += order.item.quantity;
    }
  }
  return Object.values(orderMap);
}

export function sortOrders<T extends Order | VendorUpcomingOrder>(a: T, b: T) {
  const itemNameComp = a.item.name.localeCompare(b.item.name);
  if (itemNameComp) return itemNameComp;

  const requiredAddonsOneA = a.item.requiredAddonsOne || '';
  const requiredAddonsOneB = b.item.requiredAddonsOne || '';
  const requiredAddonsOneComp =
    requiredAddonsOneA.localeCompare(requiredAddonsOneB);
  if (requiredAddonsOneComp) return requiredAddonsOneComp;

  const extraRequiredAddonsTwoA = a.item.requiredAddonsTwo || '';
  const extraRequiredAddonsTwoB = b.item.requiredAddonsTwo || '';
  const extraRequiredAddonsTwoComp = extraRequiredAddonsTwoA.localeCompare(
    extraRequiredAddonsTwoB
  );
  if (extraRequiredAddonsTwoComp) return extraRequiredAddonsTwoComp;

  const optionalAddonsA = a.item.optionalAddons || '';
  const optionalAddonsB = b.item.optionalAddons || '';
  const optionalAddonsComp = optionalAddonsA.localeCompare(optionalAddonsB);
  if (optionalAddonsComp) return optionalAddonsComp;

  const removedIngredientsA = a.item.removedIngredients || '';
  const removedIngredientsB = b.item.removedIngredients || '';
  return removedIngredientsA.localeCompare(removedIngredientsB);
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

export const splitTags = (tags: string) =>
  tags.split(',').map((tag) => tag.trim());

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

export function getTotalPayable(
  orders: CustomerOrder[],
  cartItems: CartItem[],
  user: Customer | Guest
) {
  const upcomingDateTotalDetails = orders
    .filter((order) =>
      cartItems.some(
        (cartItem) =>
          cartItem.companyId === order.company._id &&
          cartItem.deliveryDate === dateToMS(order.delivery.date)
      )
    )
    .map((order) => ({
      date: dateToMS(order.delivery.date),
      total: order.item.total - (order.payment?.distributed || 0),
    }));
  const upcomingOrderDetails = getDateTotal(upcomingDateTotalDetails);

  const cartDateTotalDetails = cartItems.map((cartItem) => {
    const optionalAddonsPrice = getAddonsTotal(cartItem.optionalAddons);
    const requiredAddonsOnePrice = getAddonsTotal(cartItem.requiredAddonsOne);
    const requiredAddonsTwoPrice = getAddonsTotal(cartItem.requiredAddonsTwo);

    const totalAddonsPrice =
      (optionalAddonsPrice || 0) +
      (requiredAddonsOnePrice || 0) +
      (requiredAddonsTwoPrice || 0);

    return {
      date: cartItem.deliveryDate,
      total: (cartItem.price + totalAddonsPrice) * cartItem.quantity,
    };
  });

  const cartItemDetails = getDateTotal(cartDateTotalDetails);
  const enrolledCompany = user.companies.find((company) => company.isEnrolled);

  if (enrolledCompany) {
    const shiftBudget = enrolledCompany.shiftBudget;
    const totalPayable = cartItemDetails
      .map((cartItemDetail) => {
        if (
          !upcomingOrderDetails.some(
            (upcomingOrderDetail) =>
              upcomingOrderDetail.date === cartItemDetail.date
          )
        ) {
          return {
            date: cartItemDetail.date,
            payable: cartItemDetail.total - shiftBudget,
          };
        } else {
          const upcomingOrderDetail = upcomingOrderDetails.find(
            (upcomingOrderDetail) =>
              upcomingOrderDetail.date === cartItemDetail.date
          );
          const upcomingDayOrderTotal = upcomingOrderDetail?.total || 0;

          return {
            date: cartItemDetail.date,
            payable:
              upcomingDayOrderTotal >= shiftBudget
                ? cartItemDetail.total
                : cartItemDetail.total - (shiftBudget - upcomingDayOrderTotal),
          };
        }
      })
      .filter((detail) => detail.payable > 0)
      .reduce((acc, curr) => acc + curr.payable, 0);

    return totalPayable;
  }
  return 0;
}

export function getPastDate(days: number) {
  const today = new Date();
  today.setDate(today.getDate() - days);

  return today.toISOString().split('T')[0];
}

export function getCustomerShifts(customer: Customer) {
  const shifts = [];
  for (const company of customer.companies) {
    if (company.shift === 'GENERAL') return [];
    if (company.isEnrollAble) shifts.push(company.shift);
  }
  return shifts;
}

export const isRestaurantSoldOut = (restaurant: UpcomingRestaurant) =>
  restaurant.schedule.status === 'INACTIVE';
