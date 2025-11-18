import { AxiosError } from 'axios';
import { Avatar } from 'data/AVATARS';
import { Dispatch, SetStateAction, ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER' | 'GUEST' | 'DRIVER';
export type UserStatus = 'ACTIVE' | 'ARCHIVED';
export type Shift = 'DAY' | 'NIGHT' | 'GENERAL';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Admin extends User {}

interface UserCompany extends CompanyDetails {
  isEnrolled: boolean;
  isEnrollAble: boolean;
}

export interface Customer extends User {
  companies: UserCompany[];
  foodPreferences?: string[];
  subscribedTo: {
    deliveryNotification: boolean;
    orderReminder: boolean;
    newsletter: boolean;
  };
  avatar?: { id: Avatar };
  isCompanyAdmin?: boolean;
}

export interface Guest extends User {
  companies: UserCompany[];
}

export interface Vendor extends User {
  restaurant: Restaurant;
}

export type Schedule = {
  _id: string;
  date: string;
  company: { code: string; shift: Shift };
  createdAt: string;
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
  isFeatured: boolean;
  createdAt: string;
  orderCapacity: number;
  schedules: Schedule[];
};

export interface ScheduledRestaurant {
  _id: string;
  name: string;
  company: {
    _id: string;
    name: string;
    code: string;
    shift: string;
  };
  schedule: Schedule;
}

export interface UpcomingRestaurant extends ScheduledRestaurant {
  logo: string;
  items: Item[];
  isFeatured: boolean;
}

export type Review = {
  _id: string;
  rating: number;
  comment: string;
};

export type SoldOutStat = {
  date: string;
  company: string;
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
  requiredAddonsOne: {
    addons: string;
    addable: number;
  };
  requiredAddonsTwo: {
    addons: string;
    addable: number;
  };
  reviews: Review[];
  averageRating?: number;
  popularityIndex?: number;
  soldOutStat?: SoldOutStat[];
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

interface CompanyDetails {
  _id: string;
  name: string;
  shift: Shift;
  code: string;
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
  shiftBudget: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface Company extends CompanyDetails {
  website: string;
  slackChannel?: string;
  createdAt: string;
}

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
  requiredAddonsOne: string;
  requiredAddonsTwo: string;
  removedIngredients: string;
};

export type VendorUpcomingOrder = {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  company: {
    _id: string;
    code: string;
    shift: Shift;
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

export interface Guests extends IsLoading {
  data: Guest[];
}

export interface DiscountCodes extends IsLoading {
  data: DiscountCode[];
}

export interface DietaryTags extends IsLoading {
  data: string[];
}

export interface DriverOrders extends IsLoading {
  data: Order[];
}

export type OrderGroup = {
  orders: Order[];
  company: {
    _id: string;
    name: string;
    shift: Shift;
    code: string;
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
  requiredAddonsOne: string[];
  requiredAddonsTwo: string[];
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
    shift: Shift;
    code: string;
  };
  delivery: {
    date: string;
    address: string;
  };
  status: string;
  payment?: {
    intent: string;
    distributed: number;
  };
  createdAt: string;
  isReviewed: boolean;
  discount?: {
    _id: string;
    code: string;
    value: number;
    distributed: number;
  };
  item: {
    _id: string;
    name: string;
    tags: string;
    image: string;
    description: string;
    quantity: number;
    total: number;
    optionalAddons: string;
    requiredAddonsOne: string;
    requiredAddonsTwo: string;
    removedIngredients: string;
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
    optionalAddons: string;
    requiredAddonsOne: string;
    requiredAddonsTwo: string;
    removedIngredients: string;
  };
  payment?: {
    distributed: number;
  };
  delivery: {
    date: string;
  };
  company: {
    _id: string;
    shift: Shift;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  isReviewed: boolean;
}

export interface SortedOrderGroups {
  byCompany: boolean;
  byDeliveryDate: boolean;
}

export type FormData = {
  [key: string]: string | number;
};

export type OrdersByRestaurant = {
  company: {
    name: string;
    shift: Shift;
    code: string;
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
  slackChannel?: string;
};

export interface ItemFormData {
  name: string;
  image?: string;
  tags: string[];
  description: string;
  price: string | number;
  file?: File | undefined;
  optionalAddons: {
    addons: string;
    addable: number;
  };
  requiredAddonsOne: {
    addons: string;
    addable: number;
  };
  requiredAddonsTwo: {
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
  isFeatured: boolean;
  addressLine1: string;
  addressLine2?: string;
  restaurantName: string;
  file?: File | undefined;
  orderCapacity: string;
  confirmPassword?: string;
};

export interface UserWithCompany extends User {
  company: Company;
}

export interface Addons {
  [key: string]: boolean;
}

export interface RemovableIngredients extends Addons {}

export type AddonsOrRemovableIngredientsType =
  | 'requiredAddonsOne'
  | 'optionalAddons'
  | 'requiredAddonsTwo'
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

export type DownloadAbles = 'labels' | 'CSV' | undefined;

export type OrderData = {
  tags: string;
  price: string;
  shift: string;
  itemName: string;
  quantity: number;
  companyName: string;
  lastName: string;
  customerEmail: string;
  description: string;
  firstName: string;
  deliveryDate: string;
  restaurantName: string;
  optionalAddons: string;
  requiredAddonsOne: string;
  removedIngredients: string;
};

export type LabelFilters = {
  companyCode: string;
  deliveryDate: string;
};

export type IdenticalOrderGroup = {
  company: {
    shift: Shift;
  };
  restaurant: {
    name: string;
  };
  delivery: {
    date: string;
  };
  item: {
    name: string;
    requiredAddonsOne: string;
    requiredAddonsTwo: string;
    optionalAddons: string;
    removedIngredients: string;
  };
  total: number;
  quantity: number;
};

export type AppliedDiscount = {
  _id: string;
  code: string;
  value: number;
};
