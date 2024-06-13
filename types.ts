import { AxiosError } from 'axios';
import { Dispatch, SetStateAction, ReactNode } from 'react';

interface User {
  _id: string;
  email: string;
  role: string;
  lastName: string;
  firstName: string;
}

export interface Admin extends User {}

export interface Customer extends User {
  status: string;
  shifts: string[];
  createdAt: string;
  companies: Company[];
  subscribedTo: {
    orderReminder: boolean;
  };
}

export interface Vendor extends User {
  status: string;
  createdAt: string;
  restaurant: Restaurant;
}

export type Schedule = {
  _id: string;
  date: string;
  company: {
    shift: 'day' | 'night';
  };
  status: 'ACTIVE' | 'INACTIVE';
};

export type Restaurant = {
  _id: string;
  name: string;
  logo: string;
  items: Item[];
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
  orderCapacity?: number;
  createdAt: string;
  schedules: Schedule[];
};

export interface ScheduledRestaurant {
  _id: string;
  name: string;
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  schedule: Schedule;
}

export interface UpcomingRestaurant extends ScheduledRestaurant {
  logo: string;
  items: Item[];
}

export type Review = {
  _id: string;
  rating: number;
  comment: string;
};

export type Item = {
  _id: string;
  tags: string;
  name: string;
  price: number;
  image: string;
  status: string;
  description: string;
  optionalAddons: {
    addons: string;
    addable: number;
  };
  requiredAddons: {
    addons: string;
    addable: number;
  };
  reviews: Review[];
  averageRating?: number;
  removableIngredients?: string;
};

export type CustomerFavoriteItem = {
  _id: string;
  item: {
    _id: string;
    name: string;
    image: string;
  };
  customer: string;
  restaurant: {
    _id: string;
    name: string;
  };
};

export type Company = {
  _id: string;
  name: string;
  shift: string;
  code: string;
  website: string;
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
  createdAt: string;
  shiftBudget: number;
  status: 'ACTIVE' | 'ARCHIVED';
};

export type DiscountCode = {
  _id: string;
  code: string;
  value: number;
  totalRedeem: number;
  redeemability: string;
};

export type ContextProviderProps = {
  children: ReactNode;
};

export type VendorUpcomingOrderItem = {
  _id: string;
  name: string;
  quantity: number;
  optionalAddons: string;
  requiredAddons: string;
  removedIngredients: string;
};

export type VendorUpcomingOrder = {
  _id: string;
  company: {
    shift: 'day' | 'night';
  };
  delivery: { date: string };
  item: VendorUpcomingOrderItem;
};

interface IsLoading {
  isLoading: boolean;
}

export interface AllUpcomingOrders extends IsLoading {
  data: Order[];
}

export interface VendorUpcomingOrders extends IsLoading {
  data: VendorUpcomingOrder[];
}

export interface ScheduledRestaurants extends IsLoading {
  data: ScheduledRestaurant[];
}

export interface Companies extends IsLoading {
  data: Company[];
}

export interface Vendors extends IsLoading {
  data: Vendor[];
}

export interface AllDeliveredOrders extends IsLoading {
  data: Order[];
}

export interface CustomerUpcomingOrders extends IsLoading {
  data: CustomerOrder[];
}

export interface CustomerDeliveredOrders extends IsLoading {
  data: CustomerOrder[];
}

export interface UpcomingRestaurants extends IsLoading {
  data: UpcomingRestaurant[];
}

export interface CustomerFavoriteItems extends IsLoading {
  data: CustomerFavoriteItem[];
}

export interface Customers extends IsLoading {
  data: Customer[];
}

export interface DiscountCodes extends IsLoading {
  data: DiscountCode[];
}

export type OrderGroup = {
  orders: Order[];
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  customers: string[];
  deliveryDate: string;
  restaurants: string[];
};

export type DateTotal = {
  date: number;
  total: number;
};

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  shift: string;
  quantity: number;
  companyId: string;
  addonPrice: number;
  restaurantId: string;
  deliveryDate: number;
  optionalAddons: string[];
  requiredAddons: string[];
  removableIngredients: string[];
}

export interface InitialItem extends CartItem {}

export type Order = {
  _id: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  delivery: {
    date: string;
    address: string;
  };
  status: string;
  payment?: {
    intent: string;
    amount: number;
  };
  createdAt: string;
  hasReviewed: boolean;
  item: {
    _id: string;
    name: string;
    tags: string;
    image: string;
    description: string;
    quantity: number;
    total: number;
    optionalAddons?: string;
    requiredAddons?: string;
    removedIngredients?: string;
  };
};

export interface CustomerOrder {
  _id: string;
  item: {
    _id: string;
    name: string;
    total: number;
    image: string;
    quantity: number;
    optionalAddons?: string;
    requiredAddons?: string;
    removedIngredients?: string;
  };
  delivery: {
    date: string;
  };
  company: {
    shift: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  hasReviewed: boolean;
}

export interface SortedOrderGroups {
  byCompany: boolean;
  byDeliveryDate: boolean;
}

export type Groups<
  Item extends object,
  Key extends keyof Item,
  ItemsName extends PropertyKey // Property key is a string | number | symbol
> = {
  [key in Key]: Item[Key];
} & { [itemsName in ItemsName]: Item[] };

export type FormData = {
  [key: string]: string | number; // Index type
};

export type OrdersByRestaurant = {
  company: {
    name: string;
    shift: string;
  };
  orders: Order[];
  deliveryDate: string;
  restaurantName: string;
};

export interface FormProps {
  isLoading: boolean;
  buttonText: string;
}

export type CompanyFormData = {
  zip: string;
  name: string;
  city: string;
  code?: string;
  state: string;
  shift?: string;
  website: string;
  shiftBudget: number;
  addressLine1: string;
  addressLine2?: string;
};

export interface ItemFormData {
  name: string;
  image?: string;
  description: string;
  currentTags?: string;
  updatedTags: string[];
  price: string | number;
  file?: File | undefined;
  optionalAddons: {
    addons: string;
    addable: number;
  };
  requiredAddons: {
    addons: string;
    addable: number;
  };
  removableIngredients?: string;
}

export type RestaurantFormData = {
  zip: string;
  city: string;
  logo?: string;
  email: string;
  state: string;
  lastName: string;
  firstName: string;
  password?: string;
  orderCapacity?: string;
  addressLine1: string;
  addressLine2?: string;
  restaurantName: string;
  file?: File | undefined;
  confirmPassword?: string;
};

export interface CustomerWithCompany extends Omit<Customer, 'companies'> {
  company: Company;
}

export interface Addons {
  [key: string]: boolean;
}

export interface RemovableIngredients extends Addons {}

export type AddonsOrRemovableIngredientsType =
  | 'requiredAddons'
  | 'optionalAddons'
  | 'removableIngredients';

export type SetAddonsOrRemovableIngredients = Dispatch<
  SetStateAction<Addons | RemovableIngredients | undefined>
>;

export interface Alert {
  type: string;
  message: string;
}

export type CustomAxiosError = AxiosError<{
  message: string;
}>;
