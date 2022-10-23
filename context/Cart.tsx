import { useUser } from "@context/User";
import { useRouter } from "next/router";
import { ICartContext, ICartItem, IContextProviderProps } from "types";
import { formatNumberToUS } from "@utils/index";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  FC,
} from "react";
import axios from "axios";

// Create context
const CartContext = createContext({} as ICartContext);

// Create hook
export const useCart = () => useContext(CartContext);

// Provider function
export default function CartProvider({ children }: IContextProviderProps) {
  const router = useRouter();
  const { isCustomer } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // Get cart items from local storage on app reload
  useEffect(() => {
    // Get cart items from local storage
    setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, [router.isReady]);

  // Remove cart item automatically
  useEffect(() => {
    if (cartItems.length > 0 && router.isReady) {
      // Get now in milliseconds
      const now = new Date().getTime();

      // Filter the items by item id
      const updatedItems = cartItems.filter(
        (cartItem) => cartItem.expiresIn > now
      );

      // Set updated items to cart
      setCartItems(updatedItems);

      // Set updated items to local storage
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  }, [router.isReady]);

  // Calculate total quantity
  const totalCartQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Calculate total price
  const totalCartPrice = cartItems.reduce(
    (acc, item) => formatNumberToUS(acc + item.total),
    0
  );

  // Add item to cart
  function addItemToCart(item: ICartItem) {
    let updatedItems = [];

    // Add item to cart
    // If the item ins't already
    //  in cart add it to the cart
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      updatedItems = [...cartItems, item];
    } else {
      // If the item is already in cart
      // update teh quantity and total
      updatedItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          return {
            ...cartItem,
            quantity: item.quantity,
            total: item.total,
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
    localStorage.setItem("cart", JSON.stringify(updatedItems));

    // Back to calendar page
    router.back();
  }

  // Remove cart item
  function removeItemFromCart(itemId: string) {
    // Filter the items by item id
    const updatedItems = cartItems.filter(
      (cartItem) => cartItem._id !== itemId
    );

    // Set updated items to cart
    setCartItems(updatedItems);

    // Set updated items to local storage
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  }

  async function checkoutCart() {
    // if (!isCustomer) router.push("/login");

    // Create an order
    try {
      // Make request to the backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
        { items: cartItems },
        {
          withCredentials: true,
        }
      );

      // Update customer's orders state
      console.log(res);
    } catch (err) {
      console.log(err);
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
