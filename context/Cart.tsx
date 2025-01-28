import { useAlert } from './Alert';
import { useData } from '@context/Data';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { Item, CartItem, CustomAxiosError, ContextProviderProps } from 'types';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';
import {
  useState,
  useEffect,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from 'react';

type CartContext = {
  cartItems: CartItem[];
  isCheckingOut: boolean;
  totalCartQuantity: number;
  removeItemFromCart: (item: CartItem) => void;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  checkout: (discountCodeId?: string) => Promise<void>;
  addItemToCart: (initialItem: CartItem, item: Item) => void;
};

const CartContext = createContext({} as CartContext);
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }: ContextProviderProps) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customer } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { setCustomerUpcomingOrders } = useData();
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);

  function addItemToCart(initialItem: CartItem, item: Item) {
    if (initialItem.requiredAddons.length < item.requiredAddons.addable) {
      return showErrorAlert(
        `Please add ${item.requiredAddons.addable} required addons`,
        setAlerts
      );
    }

    let updatedCartItems: CartItem[] = [];
    if (
      !cartItems.some(
        (cartItem) =>
          cartItem._id === initialItem._id &&
          cartItem.companyId === initialItem.companyId &&
          cartItem.deliveryDate === initialItem.deliveryDate
      )
    ) {
      updatedCartItems = [...cartItems, initialItem];
    } else {
      updatedCartItems = cartItems.map((cartItem) => {
        if (
          cartItem._id === initialItem._id &&
          cartItem.companyId === initialItem.companyId &&
          cartItem.deliveryDate === initialItem.deliveryDate
        ) {
          return {
            ...cartItem,
            quantity: initialItem.quantity,
            addonPrice: initialItem.addonPrice,
            optionalAddons: initialItem.optionalAddons,
            requiredAddons: initialItem.requiredAddons,
            removableIngredients: initialItem.removableIngredients,
          };
        } else {
          return cartItem;
        }
      });
    }
    setCartItems(updatedCartItems);
    localStorage.setItem(
      `cart-${customer?._id}`,
      JSON.stringify(updatedCartItems)
    );
    router.back();
  }

  function removeItemFromCart(item: CartItem) {
    const updatedCartItems = cartItems.filter(
      (cartItem) =>
        !(
          cartItem._id === item._id &&
          cartItem.companyId === item.companyId &&
          cartItem.deliveryDate === item.deliveryDate
        )
    );
    setCartItems(updatedCartItems);
    localStorage.setItem(
      `cart-${customer?._id}`,
      JSON.stringify(updatedCartItems)
    );
  }

  async function checkout(discountCodeId?: string) {
    if (!customer) return showErrorAlert('No user found', setAlerts);

    const orderItems = cartItems.map((cartItem) => ({
      itemId: cartItem._id,
      quantity: cartItem.quantity,
      companyId: cartItem.companyId,
      restaurantId: cartItem.restaurantId,
      deliveryDate: cartItem.deliveryDate,
      optionalAddons: cartItem.optionalAddons,
      requiredAddons: cartItem.requiredAddons,
      removedIngredients: cartItem.removableIngredients,
    }));

    try {
      setIsCheckingOut(true);

      const response = await axiosInstance.post(`/orders/create-orders`, {
        orderItems,
        discountCodeId,
      });

      if (typeof response.data === 'string') {
        open(response.data);
      } else {
        setCartItems([]);
        localStorage.removeItem(`cart-${customer._id}`);
        localStorage.removeItem(`discount-${customer._id}`);

        setCustomerUpcomingOrders((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...response.data],
        }));

        showSuccessAlert('Orders placed', setAlerts);
        router.push('/dashboard');
      }
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsCheckingOut(false);
    }
  }

  // Get cart total quantity
  useEffect(() => {
    if (cartItems.length) {
      setTotalCartQuantity(
        cartItems.reduce((acc, item) => acc + item.quantity, 0)
      );
    }
  }, [cartItems]);

  // Get cart items from local storage
  useEffect(() => {
    setCartItems(
      JSON.parse(localStorage.getItem(`cart-${customer?._id}`) || '[]')
    );
  }, [customer, router.isReady]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCheckingOut,
        setCartItems,
        checkout,
        addItemToCart,
        totalCartQuantity,
        removeItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
