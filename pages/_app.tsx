import "@styles/globals.css";
import UserProvider from "@context/User";
import DataProvider from "@context/Data";
import CartProvider from "@context/Cart";
import type { AppProps } from "next/app";
import AlertProvider from "@context/Alert";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <UserProvider>
        <DataProvider>
          <CartProvider>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </CartProvider>
        </DataProvider>
      </UserProvider>
    </AlertProvider>
  );
}
