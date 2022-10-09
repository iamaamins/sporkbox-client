import { useRouter } from "next/router";
import { useState, useEffect, createContext, useContext } from "react";

// Create context
const CartContext = createContext();

// Create hook
export const useCart = () => useContext(CartContext);

// Provider function
export default function CartProvider({ children }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  // Get cart items from local storage on app reload
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem(`cart`)) || []);
  }, [router.isReady]);

  // Add item to cart
  function addItemToCart(initialItem) {
    let updatedItems = [];

    // Add item to cart
    // If the item ins't already
    //  in cart add it to the cart
    if (!cartItems.some((cartItem) => cartItem.id === initialItem.id)) {
      updatedItems = [...cartItems, initialItem];
    } else {
      // If the item is already in cart
      // update teh quantity and total
      updatedItems = cartItems.map((cartItem) => {
        if (cartItem.id === initialItem.id) {
          return {
            ...cartItem,
            quantity: initialItem.quantity,
            total: initialItem.total,
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

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
}
