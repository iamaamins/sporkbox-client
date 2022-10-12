import "@styles/globals.css";
import "react-day-picker/dist/style.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/User";
import DataProvider from "@context/Data";
import CartProvider from "@context/Cart";

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
