import "@styles/globals.css";
import "react-day-picker/dist/style.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/user";
import LoaderProvider from "@context/loader";

export default function App({ Component, pageProps }) {
  return (
    <LoaderProvider>
      <UserProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </UserProvider>
    </LoaderProvider>
  );
}
