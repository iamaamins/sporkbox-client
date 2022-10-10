import { useUser } from "@context/user";
import { useRouter } from "next/router";
import { useState, useEffect, createContext, useContext } from "react";

// Create context
const CartContext = createContext();

// Create hook
export const useCart = () => useContext(CartContext);

// Provider function
export default function CartProvider({ children }) {
  const router = useRouter();
  const { isCustomer } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get cart items from local storage on app reload
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem(`cart`)) || []);
  }, [router.isReady]);

  // Calculate total quantity
  const totalCartQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

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

  // Remove cart item
  function removeItemFromCart(itemId) {
    // Filter the items by item id
    const updatedItems = cartItems.filter((cartItem) => cartItem.id !== itemId);

    // Set updated items to cart
    setCartItems(updatedItems);

    // Set updated items to local storage
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  }

  async function checkoutCart() {
    if (!isCustomer) router.push("/login");

    console.log(isCustomer);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        checkoutCart,
        addItemToCart,
        removeItemFromCart,
        totalCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
