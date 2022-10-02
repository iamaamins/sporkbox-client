import "@styles/globals.css";
import "react-day-picker/dist/style.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/user";
import DataProvider from "@context/data";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <DataProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </DataProvider>
    </UserProvider>
  );
}
