export interface IButtons {
  href: string;
  status?: string;
  linkText: string;
  buttonText?: string;
  handleClick: (e: FormEvent) => Promise<void>;
}

export interface IInitialItem {
  _id: string;
  date: number;
  name: string;
  price: number;
  total: number;
  quantity: number;
  restaurant: string;
}

export interface ICartItem {
  _id: string;
  date: number;
  name: string;
  price: number;
  total: number;
  quantity: number;
  restaurant: string;
}

export interface ICartContext {
  cartItems: ICartItem[];
  isLoading: boolean;
  totalCartPrice: number;
  totalCartQuantity: number;
  checkoutCart: () => Promise<void>;
  removeItemFromCart: (itemId: string) => void;
  addItemToCart: (initialItem: IInitialItem) => void;
  setCartItems: Dispatch<SetStateAction<ICartItem[]>>;
}

interface IItem {
  _id: string;
  tags: string;
  name: string;
  price: number;
  description: string;
}

export interface IVendor {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  restaurant: {
    _id: string;
    name: string;
    address: string;
    items: IItem[];
    createdAt: string;
    scheduledOn: string;
  };
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

export interface IRestaurant {
  _id: string;
  name: string;
  items: IItem[];
  address: string;
  createdAt: string;
  scheduledOn: string;
}

export interface IDataContext {
  vendors: IVendor[];
  companies: ICompany[];
  scheduledRestaurants: IRestaurant[];
  setVendors: Dispatch<SetStateAction<IVendor[]>>;
  setCompanies: Dispatch<SetStateAction<ICompany[]>>;
  setScheduledRestaurants: Dispatch<SetStateAction<IRestaurant[]>>;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: ICompany;
}

export interface IUserContext {
  isLoading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  setUser: Dispatch<SetStateAction<IUser>>;
}

export interface ICompanyInitialState {
  name: string;
  code: string;
  budget: number;
  website: string;
  address: string;
}

export interface IItemInitialState {
  name: string;
  tags: string;
  price: number;
  description: string;
}

export interface IRestaurantInitialState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  restaurantName: string;
  restaurantAddress: string;
}

export interface IScheduleRestaurantInitialState {
  date: string;
  restaurantId: string;
}

export interface IRestaurantGroup {
  scheduleOn: string;
  restaurants: IRestaurant[];
}

export interface ILoginInitialState {
  email: string;
  password: string;
}

export interface IRegisterInitialState {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface IActionButtonProps {
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

export interface IMobileNavProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
