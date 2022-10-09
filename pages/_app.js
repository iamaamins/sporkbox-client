import "@styles/globals.css";
import "react-day-picker/dist/style.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/user";
import DataProvider from "@context/data";
import CartProvider from "@context/cart";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <CartProvider>
        <DataProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </DataProvider>
      </CartProvider>
    </UserProvider>
  );
}
