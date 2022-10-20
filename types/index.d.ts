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
  scheduledOn: string;
}

export interface IScheduledRestaurant {
  _id: string;
  name: string;
  items: Item[];
  scheduledOn: string;
}

interface IItem {
  _id: string;
  tags: string;
  name: string;
  price: number;
  description: string;
}

export interface ICompany {
  _id: string;
  name: string;
  code: string;
  budget: number;
  website: string;
  address: string;
  createdAt: string;
}

export interface IContextProviderProps {
  children: React.ReactNode;
}

export interface IUserContext {
  isLoading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  setUser: Dispatch<SetStateAction<IUser>>;
}

export interface IDataContext {
  vendors: IVendor[];
  allOrders: IOrder[];
  companies: ICompany[];
  activeOrders: IOrder[];
  deliveredOrders: IOrder[];
  scheduledRestaurants: IScheduledRestaurant[];
  setVendors: Dispatch<SetStateAction<IVendor[]>>;
  setCompanies: Dispatch<SetStateAction<ICompany[]>>;
  setActiveOrders: Dispatch<SetStateAction<IOrder[]>>;
  setDeliveredOrders: Dispatch<SetStateAction<IOrder[]>>;
  setScheduledRestaurants: Dispatch<SetStateAction<IScheduledRestaurant[]>>;
}

export interface ICartContext {
  cartItems: ICartItem[];
  isLoading: boolean;
  totalCartPrice: number;
  totalCartQuantity: number;
  checkoutCart: () => Promise<void>;
  removeItemFromCart: (itemId: string) => void;
  addItemToCart: (item: ICartItem) => void;
  setCartItems: Dispatch<SetStateAction<ICartItem[]>>;
}

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  total: number;
  quantity: number;
  restaurantId: string;
  deliveryDate: number;
  restaurantName: string;
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

export interface IRestaurantsGroup {
  scheduledOn: string;
  restaurants: IScheduledRestaurant[];
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

export interface IFilterProps {
  orders: IOrder[];
  showFilters: boolean;
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
  isDisabled: boolean;
}

export interface ILinkButtonProps {
  text: string;
  href: string;
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
