import { Dispatch, SetStateAction, ReactNode, FormEvent } from "react";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
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
  date: string;
  company: {
    _id: string;
    name: string;
  };
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

export interface IAllUpcomingOrders extends IIsLoading {
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

export interface ICustomerUpcomingOrders extends IIsLoading {
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
  allUpcomingOrders: IAllUpcomingOrders;
  allDeliveredOrders: IAllDeliveredOrders;
  customerAllOrders: ICustomerOrder[];
  customerUpcomingOrders: ICustomerUpcomingOrders;
  customerDeliveredOrders: ICustomerDeliveredOrders;
  scheduledRestaurants: IScheduledRestaurants;
  customerFavoriteItems: ICustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<IVendors>>;
  nextWeekBudgetAndDates: INextWeekBudgetAndDates[];
  upcomingWeekRestaurants: IUpcomingWeekRestaurants;
  upcomingOrdersGroups: IOrdersGroup[];
  deliveredOrdersGroups: IOrdersGroup[];
  setCompanies: Dispatch<SetStateAction<ICompanies>>;
  setAllUpcomingOrders: Dispatch<SetStateAction<IAllUpcomingOrders>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<IAllDeliveredOrders>>;
  setCustomerUpcomingOrders: Dispatch<SetStateAction<ICustomerUpcomingOrders>>;
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
    name: string;
  };
  delivery: {
    date: string;
    address: string;
  };
  status: string;
  hasReviewed: boolean;
  createdAt: string;
  item: {
    _id: string;
    name: string;
    tags: string;
    description: string;
    quantity: number;
    total: number;
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
  delivery: {
    date: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  hasReviewed: boolean;
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

export interface IOrdersGroupRowProps {
  slug: string;
  ordersGroup: IOrdersGroup;
}

export interface IOrdersGroupsProps {
  slug: string;
  title: string;
  ordersGroups: IOrdersGroup[];
}

export interface ISorted {
  byCompany: boolean;
  byDeliveryDate: boolean;
}

export interface IFilterAndSortProps {
  ordersGroups: IOrdersGroup[];
  setSorted: Dispatch<SetStateAction<ISorted>>;
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

export interface IOrdersGroup {
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

export interface IOrdersGroupDetailsProps {
  isLoading: boolean;
  ordersGroups: IOrdersGroup[];
}

export interface IModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}
