export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
  company?: ICompany;
  restaurant?: IRestaurant;
}

export interface IVendor extends IUser {
  status: string;
  createdAt: string;
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
  companies: ICompany[];
  scheduledRestaurants: IRestaurant[];
  setVendors: Dispatch<SetStateAction<IVendor[]>>;
  setCompanies: Dispatch<SetStateAction<ICompany[]>>;
  setScheduledRestaurants: Dispatch<SetStateAction<IRestaurant[]>>;
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
  restaurant: string;
  deliveryDate: number;
}

export interface IRestaurantGroup {
  scheduledOn: string;
  restaurants: IRestaurant[];
}

export interface IButtons {
  href: string;
  linkText: string;
  buttonText: string;
  handleClick: (e: FormEvent) => Promise<void>;
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
