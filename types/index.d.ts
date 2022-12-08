import { Dispatch, SetStateAction, ReactNode, FormEvent } from "react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  company?: ICompany;
  restaurant?: IRestaurant;
}

export interface IVendor extends IUser {
  status: string;
  restaurant: IRestaurant;
}

export interface IRestaurant {
  _id: string;
  name: string;
  items: IItem[];
  address: string;
  createdAt: string;
  schedules: string[];
}

export interface IScheduledRestaurant {
  _id: string;
  name: string;
  scheduledOn: string;
}

export interface IUpcomingWeekRestaurant extends IScheduledRestaurant {
  items: IItem[];
}

interface IItem {
  _id: string;
  tags: string;
  name: string;
  price: number;
  description: string;
}

export interface ICustomerFavoriteItem {
  _id: string;
  itemId: string;
  itemName: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
}

export interface ICompany {
  _id: string;
  name: string;
  code: string;
  website: string;
  address: string;
  createdAt: string;
  dailyBudget: number;
}

export interface IContextProviderProps {
  children: ReactNode;
}

export interface IUserContext {
  user: IUser | null;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  isUserLoading: boolean;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}

export interface IAllActiveOrdersCtx {
  data: IOrder[];
  isLoading: boolean;
}

export interface IScheduledRestaurantsCtx {
  data: IScheduledRestaurant[];
  isLoading: boolean;
}

export interface ICompaniesCtx {
  data: ICompany[];
  isLoading: boolean;
}

export interface IVendorsCtx {
  data: IVendor[];
  isLoading: boolean;
}

export interface IAllDeliveredOrdersCtx {
  data: IOrder[];
  isLoading: boolean;
}

export interface ICustomerActiveOrdersCtx {
  data: ICustomerOrder[];
  isLoading: boolean;
}

export interface ICustomerDeliveredOrdersCtx {
  data: ICustomerOrder[];
  isLoading: boolean;
}

export interface IUpcomingWeekRestaurantsCtx {
  data: IUpcomingWeekRestaurant[];
  isLoading: boolean;
}

export interface ICustomerFavoriteItemsCtx {
  data: ICustomerFavoriteItem[];
  isLoading: boolean;
}

export interface INextWeekBudgetAndDates {
  nextWeekDate: number;
  budgetOnHand: number;
}

export interface IDataContext {
  vendors: IVendorsCtx;
  allOrders: IOrder[];
  companies: ICompaniesCtx;
  nextWeekDates: number[];
  allActiveOrders: IAllActiveOrdersCtx;
  allDeliveredOrders: IAllDeliveredOrdersCtx;
  customerAllOrders: ICustomerOrder[];
  customerActiveOrders: ICustomerActiveOrdersCtx;
  customerDeliveredOrders: ICustomerDeliveredOrdersCtx;
  scheduledRestaurants: IScheduledRestaurantsCtx;
  customerFavoriteItems: ICustomerFavoriteItemsCtx;
  setVendors: Dispatch<SetStateAction<IVendorsCtx>>;
  nextWeekBudgetAndDates: INextWeekBudgetAndDates[];
  upcomingWeekRestaurants: IUpcomingWeekRestaurantsCtx;
  setCompanies: Dispatch<SetStateAction<ICompaniesCtx>>;
  setAllActiveOrders: Dispatch<SetStateAction<IAllActiveOrdersCtx>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<IAllDeliveredOrdersCtx>>;
  setCustomerActiveOrders: Dispatch<SetStateAction<ICustomerActiveOrdersCtx>>;
  setCustomerDeliveredOrders: Dispatch<
    SetStateAction<ICustomerDeliveredOrdersCtx>
  >;
  setScheduledRestaurants: Dispatch<SetStateAction<IScheduledRestaurantsCtx>>;
  setCustomerFavoriteItems: Dispatch<SetStateAction<ICustomerFavoriteItemsCtx>>;
}

export interface ICartContext {
  cartItems: ICartItem[];
  isLoading: boolean;
  totalCartPrice: number;
  totalCartQuantity: number;
  checkoutCart: () => Promise<void>;
  addItemToCart: (item: ICartItem) => void;
  removeItemFromCart: (item: ICartItem) => void;
  setCartItems: Dispatch<SetStateAction<ICartItem[]>>;
}

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  expiresIn: number;
  restaurantId: string;
  deliveryDate: number;
}

export interface IOrder {
  _id: string;
  status: string;
  customerId: string;
  createdAt: string;
  restaurantId: string;
  companyName: string;
  customerName: string;
  deliveryDate: string;
  customerEmail: string;
  restaurantName: string;
  deliveryAddress: string;
  item: {
    _id: string;
    name: string;
    total: number;
    quantity: number;
  };
}

export interface ICustomerOrder {
  _id: string;
  item: {
    _id: string;
    name: string;
    total: number;
    quantity: number;
  };
  status: string;
  createdAt: string;
  hasReviewed: boolean;
  deliveryDate: string;
  restaurantId: string;
  restaurantName: string;
}

export interface ICustomerOrderProps {
  orders: ICustomerOrder[];
}

export interface IOrdersGroup {
  [key: string]: string | IOrder[];
}

export interface IFiltersData {
  category: string;
  subCategory: string;
}

export interface IOrderProps {
  order: IOrder;
}

export interface IOrdersProps {
  title: string;
  orders: IOrder[];
}

export interface IFilterAndSortProps {
  orders: IOrder[];
  showController: boolean;
  setFilteredOrders: Dispatch<SetStateAction<IOrder[]>>;
}

export interface IButtons {
  href: string;
  linkText: string;
  buttonText: string;
  handleClick: (e: FormEvent) => Promise<void>;
}

export interface IActionButton {
  isLoading: boolean;
  buttonText: string;
  handleClick: () => Promise<void>;
}

export interface ISubmitButtonProps {
  text: string;
  isLoading: boolean;
}

export interface ILinkButtonProps {
  href: string;
  linkText: string;
}

export interface IMobileMenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IMobileNavProps extends IMobileMenuProps {}

export type Groups<
  Item extends object,
  Key extends keyof Item,
  ItemsName extends PropertyKey // Property key is a string | number | symbol
> = {
  [key in Key]: Item[Key];
} & { [itemsName in ItemsName]: Item[] };

export interface IFormData {
  [key: string]: string | number; // Index type
}

export interface IOrderGroup {
  orders: IOrder[];
  restaurants: string[];
  companyName: string;
  deliveryDate: string;
}
