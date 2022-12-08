import { useData } from "@context/Data";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import { axiosInstance, formatNumberToUS } from "@utils/index";
import { ICartContext, ICartItem, IContextProviderProps } from "types";
import { useState, useEffect, useContext, createContext } from "react";

// Create context
const CartContext = createContext({} as ICartContext);

// Create hook
export const useCart = () => useContext(CartContext);

// Provider function
export default function CartProvider({ children }: IContextProviderProps) {
  const router = useRouter();
  const { user, isCustomer } = useUser();
  const { setCustomerActiveOrders } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // Get cart items from local storage on app reload
  useEffect(() => {
    // Get cart items from local storage
    setCartItems(JSON.parse(localStorage.getItem(`cart-${user?._id}`) || "[]"));
  }, [user, router.isReady]);

  // Remove cart item automatically
  useEffect(() => {
    if (cartItems.length > 0 && router.isReady) {
      // Filter the items by item id
      const updatedItems = cartItems.filter(
        (cartItem) => cartItem.expiresIn > Date.now()
      );

      // Set updated items to cart
      setCartItems(updatedItems);

      // Set updated items to local storage
      localStorage.setItem(`cart-${user?._id}`, JSON.stringify(updatedItems));
    }
  }, [user, router.isReady]);

  // Calculate total quantity
  const totalCartQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Calculate total price
  const totalCartPrice = cartItems.reduce(
    (acc, item) => formatNumberToUS(acc + item.price * item.quantity),
    0
  );

  // Add item to cart
  function addItemToCart(item: ICartItem) {
    let updatedItems = [];

    // Add item to cart if the
    // item ins't already in cart
    if (
      !cartItems.some(
        (cartItem) =>
          cartItem._id === item._id &&
          cartItem.deliveryDate === item.deliveryDate
      )
    ) {
      updatedItems = [...cartItems, item];
    } else {
      // If the item is already
      // in cart update the quantity
      updatedItems = cartItems.map((cartItem) => {
        if (
          cartItem._id === item._id &&
          cartItem.deliveryDate === item.deliveryDate
        ) {
          return {
            ...cartItem,
            quantity: item.quantity,
          };
        } else {
          // Return other cart items
          return cartItem;
        }
      });
    }

    // Update state
    setCartItems(updatedItems);

    // Save cart to local storage
    localStorage.setItem(`cart-${user?._id}`, JSON.stringify(updatedItems));

    // Back to calendar page
    router.back();
  }

  // Remove cart item
  function removeItemFromCart(item: ICartItem) {
    // Filter the items by item id
    const updatedItems = cartItems.filter(
      (cartItem) =>
        !(
          cartItem._id === item._id &&
          cartItem.deliveryDate === item.deliveryDate
        )
    );

    // Set updated items to cart
    setCartItems(updatedItems);

    // Set updated items to local storage
    localStorage.setItem(`cart-${user?._id}`, JSON.stringify(updatedItems));
  }

  // Checkout cart
  async function checkoutCart() {
    if (isCustomer) {
      // Create an order
      try {
        // Show loader
        setIsLoading(true);

        // Make request to the backend
        const response = await axiosInstance.post(`/orders/create`, {
          orderItems: cartItems,
        });

        // Update customer's active orders state
        setCustomerActiveOrders((currState) => ({
          ...currState,
          data: [...currState.data, ...response.data],
        }));

        // Remove cart items
        setCartItems([]);
        localStorage.removeItem(`cart-${user?._id}`);

        // Push to the dashboard page
        router.push("/dashboard");
      } catch (err) {
        console.log(err);
      } finally {
        // Remove loader
        setIsLoading(false);
      }
    } else {
      router.push("/login");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        setCartItems,
        checkoutCart,
        addItemToCart,
        totalCartPrice,
        totalCartQuantity,
        removeItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
