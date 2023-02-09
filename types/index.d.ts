import { Dispatch, SetStateAction, ReactNode, FormEvent } from "react";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  company?: ICompany;
  restaurant?: IRestaurant;
}

export interface IVendor extends IUser {
  status: string;
  restaurant: IRestaurant;
}

export interface ICustomers {
  data: IUser[];
  isLoading: boolean;
}

export interface IRestaurant {
  _id: string;
  name: string;
  logo: string;
  items: IItem[];
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
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
  status: string;
  scheduleId: string;
}

export interface IUpcomingRestaurant extends IScheduledRestaurant {
  logo: string;
  items: IItem[];
}

interface IItem {
  _id: string;
  tags: string;
  name: string;
  price: number;
  image: string;
  status: string;
  description: string;
  addableIngredients?: string;
  removableIngredients?: string;
}

export interface ICustomerFavoriteItem {
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
}

export interface ICompany {
  _id: string;
  name: string;
  code: string;
  status: string;
  website: string;
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
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

export interface IUpcomingRestaurants extends IIsLoading {
  data: IUpcomingRestaurant[];
}

export interface ICustomerFavoriteItems extends IIsLoading {
  data: ICustomerFavoriteItem[];
}

export interface ICustomers extends IIsLoading {
  data: IUser[];
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
  customers: ICustomers;
  customerAllOrders: ICustomerOrder[];
  upcomingOrdersGroups: IOrdersGroup[];
  deliveredOrdersGroups: IOrdersGroup[];
  allUpcomingOrders: IAllUpcomingOrders;
  allDeliveredOrders: IAllDeliveredOrders;
  upcomingRestaurants: IUpcomingRestaurants;
  scheduledRestaurants: IScheduledRestaurants;
  customerFavoriteItems: ICustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<IVendors>>;
  customerUpcomingOrders: ICustomerUpcomingOrders;
  customerDeliveredOrders: ICustomerDeliveredOrders;
  nextWeekBudgetAndDates: INextWeekBudgetAndDates[];
  setCompanies: Dispatch<SetStateAction<ICompanies>>;
  setCustomers: Dispatch<SetStateAction<ICustomers>>;
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
  image: string;
  quantity: number;
  addonPrice: number;
  restaurantId: string;
  deliveryDate: number;
  addableIngredients: string[];
  removableIngredients: string[];
}

export interface IInitialItem extends ICartItem {}

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
    _id: string;
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
    image: string;
    description: string;
    quantity: number;
    total: number;
    addedIngredients?: string;
    removedIngredients?: string;
  };
}

export interface ICustomerOrder {
  _id: string;
  item: {
    _id: string;
    name: string;
    total: number;
    image: string;
    quantity: number;
    addedIngredients?: string;
    removedIngredients?: string;
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
  initiateStatusUpdate: (e: FormEvent) => void;
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

export interface IStaticTags {
  [key: string]: boolean;
}

interface IFormProps {
  isLoading: boolean;
  formData: IFormData;
  buttonText: string;
  setFormData: Dispatch<SetStateAction<IFormData>>;
}

export interface ICompanyFormProps extends IFormProps {
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export interface IItemFormData {
  name: string;
  image?: string;
  description: string;
  currentTags?: string;
  updatedTags: string[];
  price: string | number;
  file?: File | undefined;
  addableIngredients?: string;
  removableIngredients?: string;
}

export interface IItemFormProps extends IFormProps {
  formData: IItemFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<IItemFormData>>;
}

export interface IRestaurantFormData {
  zip: string;
  city: string;
  logo?: string;
  email: string;
  state: string;
  lastName: string;
  firstName: string;
  password?: string;
  addressLine1: string;
  addressLine2?: string;
  restaurantName: string;
  file?: File | undefined;
  confirmPassword?: string;
}

export interface IRestaurantFormProps extends IFormProps {
  showPasswordFields: boolean;
  formData: IRestaurantFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<IRestaurantFormData>>;
}

export interface IModalContainerProps {
  component: JSX.Element;
  showModalContainer: boolean;
  setShowModalContainer: Dispatch<SetStateAction<boolean>>;
}

export interface ICustomersProps {
  status: string;
  customers: IUser[];
}

export interface IActionModalProps {
  name: string;
  action: string;
  isPerformingAction: boolean;
  performAction: () => Promise<void>;
  setShowActionModal: Dispatch<SetStateAction<boolean>>;
}

export interface IDeliverOrdersPayload {
  orders: IOrder[];
  restaurantName: string;
}

export interface ICustomerOrdersProps {
  orders: IOrder[];
  orderStatus: string;
}

export interface ICustomerWithOrders {
  data: IUser | undefined;
  upcomingOrders: IOrder[];
  deliveredOrders: IOrder[];
}

export interface IAddOrRemovableIngredients {
  [key: string]: boolean;
}

export type IngredientsType = "addableIngredients" | "removableIngredients";

export type SetIngredients = Dispatch<
  SetStateAction<IAddOrRemovableIngredients | undefined>
>;

export interface IAlert {
  type: string;
  message: string;
}

export interface IAlertProps {
  alerts: IAlert[];
}

export interface IAlertContext {
  setAlerts: Dispatch<SetStateAction<IAlert[]>>;
}

export interface IAxiosError {
  message: string;
}

export interface IScheduledRestaurantProps {
  isLoading: boolean;
  restaurants: IScheduledRestaurant[];
}

// export interface IItemFormData {
//   name: string;
//   tags: string[];
//   price: number;
//   image: string;
//   description: string;
//   addableIngredients?: string;
//   removableIngredients?: string;
// }
