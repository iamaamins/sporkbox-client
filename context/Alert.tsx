import Alert from '@components/layout/Alert';
import { Alert as AlertType, ContextProviderProps } from 'types';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AlertContext = { setAlerts: Dispatch<SetStateAction<AlertType[]>> };

const AlertContext = createContext({} as AlertContext);
export const useAlert = () => useContext(AlertContext);

export default function AlertProvider({ children }: ContextProviderProps) {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  useEffect(() => {
    if (alerts.length > 0) {
      const removeAlert = setTimeout(() => {
        setAlerts((prevState) =>
          prevState.filter((alert, index) => index !== 0)
        );
      }, 3000);
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
