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

interface IIsLoading {
  isLoading: boolean;
}

export interface IAllActiveOrders extends IIsLoading {
  data: IOrder[];
}

export interface IScheduledRestaurants extends IIsLoading {
  data: IScheduledRestaurant[];
}

export interface ICompanies extends IIsLoading {
  data: ICompany[];
}

export interface IVendors extends IIsLoading {
  data: IVendor[];
}

export interface IAllDeliveredOrders extends IIsLoading {
  data: IOrder[];
}

export interface ICustomerActiveOrders extends IIsLoading {
  data: ICustomerOrder[];
}

export interface ICustomerDeliveredOrders extends IIsLoading {
  data: ICustomerOrder[];
}

export interface IUpcomingWeekRestaurants extends IIsLoading {
  data: IUpcomingWeekRestaurant[];
}

export interface ICustomerFavoriteItems extends IIsLoading {
  data: ICustomerFavoriteItem[];
}

export interface INextWeekBudgetAndDates {
  nextWeekDate: number;
  budgetOnHand: number;
}

export interface IDataContext {
  vendors: IVendors;
  allOrders: IOrder[];
  companies: ICompanies;
  nextWeekDates: number[];
  allActiveOrders: IAllActiveOrders;
  allDeliveredOrders: IAllDeliveredOrders;
  customerAllOrders: ICustomerOrder[];
  customerActiveOrders: ICustomerActiveOrders;
  customerDeliveredOrders: ICustomerDeliveredOrders;
  scheduledRestaurants: IScheduledRestaurants;
  customerFavoriteItems: ICustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<IVendors>>;
  nextWeekBudgetAndDates: INextWeekBudgetAndDates[];
  upcomingWeekRestaurants: IUpcomingWeekRestaurants;
  setCompanies: Dispatch<SetStateAction<ICompanies>>;
  setAllActiveOrders: Dispatch<SetStateAction<IAllActiveOrders>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<IAllDeliveredOrders>>;
  setCustomerActiveOrders: Dispatch<SetStateAction<ICustomerActiveOrders>>;
  setCustomerDeliveredOrders: Dispatch<
    SetStateAction<ICustomerDeliveredOrders>
  >;
  setScheduledRestaurants: Dispatch<SetStateAction<IScheduledRestaurants>>;
  setCustomerFavoriteItems: Dispatch<SetStateAction<ICustomerFavoriteItems>>;
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

export interface IOrdersByCompanyAndDeliveryDate {
  orders: IOrder[];
  restaurants: string[];
  companyName: string;
  deliveryDate: string;
}

export interface IOrdersByRestaurant {
  companyName: string;
  restaurantName: string;
  orders: IOrder[];
  deliveryDate: string;
}
