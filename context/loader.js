import { createContext, useContext, useState } from "react";

// Create context
const LoaderContext = createContext();

// Create hook
export const useLoader = () => useContext(LoaderContext);

// Provider Function
export default function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}
