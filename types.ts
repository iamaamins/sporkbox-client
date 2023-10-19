import { AxiosError } from 'axios';
import { Dispatch, SetStateAction, ReactNode, FormEvent } from 'react';

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

export interface Restaurant {
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
  createdAt: string;
  schedules: string[];
}

export interface ScheduledRestaurant {
  _id: string;
  name: string;
  date: string;
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  status: string;
  scheduleId: string;
}

export interface UpcomingRestaurant extends ScheduledRestaurant {
  logo: string;
  items: Item[];
  scheduledAt: string;
}

export interface Item {
  _id: string;
  tags: string;
  name: string;
  price: number;
  image: string;
  status: string;
  description: string;
  optionalAddons: Addon[];
  requiredAddons: Addon[];
  removableIngredients?: string;
}

export interface CustomerFavoriteItem {
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

export interface Company {
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
}

export interface DiscountCode {
  _id: string;
  code: string;
  value: number;
  totalRedeem: number;
  redeemability: string;
}

export interface ContextProviderProps {
  children: ReactNode;
}

export interface UserContext {
  isAdmin: boolean;
  isCustomer: boolean;
  admin: Admin | null;
  isUserLoading: boolean;
  customer: Customer | null;
  setAdmin: Dispatch<SetStateAction<Admin | null>>;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
}

interface IsLoading {
  isLoading: boolean;
}

export interface AllUpcomingOrders extends IsLoading {
  data: Order[];
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

export interface OrdersGroup {
  orders: Order[];
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  customers: string[];
  deliveryDate: string;
  restaurants: string[];
}

export interface DataContext {
  vendors: Vendors;
  allOrders: Order[];
  companies: Companies;
  customers: Customers;
  upcomingDates: number[];
  discountCodes: DiscountCodes;
  customerAllOrders: CustomerOrder[];
  upcomingOrdersGroups: OrdersGroup[];
  deliveredOrdersGroups: OrdersGroup[];
  allUpcomingOrders: AllUpcomingOrders;
  allDeliveredOrders: AllDeliveredOrders;
  upcomingRestaurants: UpcomingRestaurants;
  scheduledRestaurants: ScheduledRestaurants;
  customerFavoriteItems: CustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<Vendors>>;
  customerUpcomingOrders: CustomerUpcomingOrders;
  customerDeliveredOrders: CustomerDeliveredOrders;
  setCompanies: Dispatch<SetStateAction<Companies>>;
  setCustomers: Dispatch<SetStateAction<Customers>>;
  setDiscountCodes: Dispatch<SetStateAction<DiscountCodes>>;
  setAllUpcomingOrders: Dispatch<SetStateAction<AllUpcomingOrders>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<AllDeliveredOrders>>;
  setCustomerUpcomingOrders: Dispatch<SetStateAction<CustomerUpcomingOrders>>;
  setCustomerDeliveredOrders: Dispatch<SetStateAction<CustomerDeliveredOrders>>;
  setScheduledRestaurants: Dispatch<SetStateAction<ScheduledRestaurants>>;
  setCustomerFavoriteItems: Dispatch<SetStateAction<CustomerFavoriteItems>>;
}

export interface DateTotal {
  date: number;
  total: number;
}

export interface CartContext {
  cartItems: CartItem[];
  isLoading: boolean;
  totalCartPrice: number;
  totalCartQuantity: number;
  upcomingOrderDetails: DateTotal[];
  removeItemFromCart: (item: CartItem) => void;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  checkoutCart: (discountCodeId?: string) => Promise<void>;
  addItemToCart: (initialItem: CartItem, item: Item) => void;
}

export type CartAddon = {
  index: number;
  addons: string[];
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
  optionalAddons: CartAddon[];
  requiredAddons: CartAddon[];
  removableIngredients: string[];
}

export interface InitialItem extends CartItem {}

export interface Order {
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
}

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

export interface CustomerOrderProps {
  orders: CustomerOrder[];
}

export interface FiltersData {
  category: string;
  subCategory: string;
}

export interface OrdersGroupRowProps {
  slug: string;
  ordersGroup: OrdersGroup;
}

export interface OrdersGroupsProps {
  slug: string;
  title: string;
  ordersGroups: OrdersGroup[];
}

export interface SortedOrdersGroups {
  byCompany: boolean;
  byDeliveryDate: boolean;
}

export interface SortOrdersGroupsProps {
  ordersGroups: OrdersGroup[];
  setSorted: Dispatch<SetStateAction<SortedOrdersGroups>>;
}

export interface Buttons {
  href: string;
  linkText: string;
  buttonText: string;
  initiateStatusUpdate: (e: FormEvent) => void;
}

export interface ActionButton {
  isLoading: boolean;
  buttonText: string;
  handleClick: () => Promise<void>;
}

export interface SubmitButtonProps {
  text: string;
  isLoading: boolean;
}

export interface LinkButtonProps {
  href: string;
  target?: string;
  linkText: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface MobileNavProps extends MobileMenuProps {}

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

export interface OrdersByRestaurant {
  company: {
    name: string;
    shift: string;
  };
  orders: Order[];
  deliveryDate: string;
  restaurantName: string;
}

export interface OrdersGroupDetailsProps {
  isLoading: boolean;
  ordersGroups: OrdersGroup[];
}

export interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export interface StaticTags {
  [key: string]: boolean;
}

interface FormProps {
  isLoading: boolean;
  buttonText: string;
}

export interface CompanyFormData {
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
}

export interface CompanyFormProps extends FormProps {
  formData: CompanyFormData;
  showShiftAndCodeField: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<CompanyFormData>>;
}

type Addon = {
  addons: string;
  addable: number;
};

export interface ItemFormData {
  name: string;
  image?: string;
  description: string;
  currentTags?: string;
  updatedTags: string[];
  price: string | number;
  file?: File | undefined;
  optionalAddons: Addon[];
  requiredAddons: Addon[];
  removableIngredients?: string;
}

export interface ItemFormProps extends FormProps {
  formData: ItemFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<ItemFormData>>;
}

export interface RestaurantFormData {
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

export interface RestaurantFormProps extends FormProps {
  showPasswordFields: boolean;
  formData: RestaurantFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<RestaurantFormData>>;
}

export interface ModalContainerProps {
  width?: string;
  component: JSX.Element;
  showModalContainer: boolean;
  setShowModalContainer: Dispatch<SetStateAction<boolean>>;
}

export interface CustomersProps {
  status?: string;
  customers: Customer[];
}

export interface ActionModalProps {
  name: string;
  action: string;
  isPerformingAction: boolean;
  performAction: () => Promise<void>;
  setShowActionModal: Dispatch<SetStateAction<boolean>>;
}

export interface DeliverOrdersPayload {
  orders: Order[];
  restaurantName: string;
}

export interface CustomerOrdersProps {
  orders: Order[];
  orderStatus: string;
}

interface CustomerWithCompany extends Omit<Customer, 'companies'> {
  company: Company;
}

export interface CustomerWithOrders {
  upcomingOrders: Order[];
  deliveredOrders: Order[];
  data: CustomerWithCompany | null;
}

export interface Alert {
  type: string;
  message: string;
}

export interface AlertProps {
  alerts: Alert[];
}

export interface AlertContext {
  setAlerts: Dispatch<SetStateAction<Alert[]>>;
}

export type CustomAxiosError = AxiosError<{
  message: string;
}>;

export interface ScheduledRestaurantProps {
  isLoading: boolean;
  restaurants: ScheduledRestaurant[];
}

export interface ShiftChangeModalProps {
  setShowShiftChangeModal: Dispatch<SetStateAction<boolean>>;
}

export interface FilterRestaurantsProps {
  shifts: string[];
  setRestaurants: Dispatch<SetStateAction<UpcomingRestaurant[]>>;
}

export interface CalendarFiltersProps {
  restaurants: UpcomingRestaurant[];
  setShowCalendarFilters: Dispatch<SetStateAction<boolean>>;
  setUpdatedRestaurants: Dispatch<SetStateAction<UpcomingRestaurant[]>>;
}

export interface CalendarSortProps {
  updatedRestaurants: UpcomingRestaurant[];
  setSorted: Dispatch<
    SetStateAction<{ byLowToHigh: boolean; byHighToLow: boolean }>
  >;
}

export interface OrderData {
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
  optionalAddons?: string;
  requiredAddons?: string;
  removedIngredients?: string;
}

export type ReorderAbleItemsProps = {
  vendor: Vendor;
  setVendor: Dispatch<SetStateAction<Vendor | undefined>>;
};
