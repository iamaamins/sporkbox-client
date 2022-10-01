import "@styles/globals.css";
import "react-day-picker/dist/style.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/user";
import RestaurantsProvider from "@context/restaurants";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <RestaurantsProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </RestaurantsProvider>
    </UserProvider>
  );
}
