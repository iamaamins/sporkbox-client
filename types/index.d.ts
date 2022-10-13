export interface IButtons {
  href: string;
  status?: string;
  linkText: string;
  buttonText?: string;
  handleClick: (e: FormEvent) => Promise<void>;
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
  addItemToCart: (item: ICartItem) => void;
  setCartItems: Dispatch<SetStateAction<ICartItem[]>>;
}

interface IItem {
  _id: string;
  tags: string;
  name: string;
  price: number;
  description: string;
}

export interface IRestaurant {
  _id: string;
  name: string;
  items: IItem[];
  address: string;
  createdAt: string;
  scheduledOn: string;
}

export interface IVendor {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  restaurant: IRestaurant;
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
  restaurant?: IRestaurant;
}

export interface IUserContext {
  isLoading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  setUser: Dispatch<SetStateAction<IUser>>;
}

export interface ICompanyState {
  name: string;
  code: string;
  budget: number;
  website: string;
  address: string;
}

export interface IItemState {
  name: string;
  tags: string;
  price: number;
  description: string;
}

export interface IRestaurantState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  restaurantName: string;
  restaurantAddress: string;
}

export interface ILoginState {
  email: string;
  password: string;
}

export interface IRegisterState {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface IScheduleRestaurantState {
  date: string;
  restaurantId: string;
}

export interface IRestaurantGroup {
  scheduledOn: string;
  restaurants: IRestaurant[];
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

export interface IMobileNavProps extends IMobileMenuProps {}

export interface IContextProviderProps {
  children: React.ReactNode;
}
