import Alert from '@components/layout/Alert';
import { IAlert, IAlertContext, IContextProviderProps } from 'types';
import { createContext, useContext, useEffect, useState } from 'react';

// Create context
const AlertContext = createContext({} as IAlertContext);

// Create hook
export const useAlert = () => useContext(AlertContext);

// Provider function
export default function AlertProvider({ children }: IContextProviderProps) {
  // Hooks
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  useEffect(() => {
    if (alerts.length > 0) {
      // Remove alert after 3 seconds
      const removeAlert = setTimeout(() => {
        setAlerts((prevState) =>
          prevState.filter((alert, index) => index !== 0)
        );
      }, 3000);

      // Clear time out
      return () => clearTimeout(removeAlert);
    }
  }, [alerts]);

  return (
    <AlertContext.Provider value={{ setAlerts }}>
      {children}
      <Alert alerts={alerts} />
    </AlertContext.Provider>
  );
}
