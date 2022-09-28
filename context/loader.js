import { createContext, useContext, useState } from "react";

// Create context
const LoaderContext = createContext();

// Create hook
export const useLoader = () => useContext(LoaderContext);

// Provider Function
export default function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}
