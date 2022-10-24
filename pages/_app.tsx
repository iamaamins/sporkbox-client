import "@styles/globals.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/User";
import DataProvider from "@context/Data";
import CartProvider from "@context/Cart";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <DataProvider>
        <CartProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </CartProvider>
      </DataProvider>
    </UserProvider>
  );
}
