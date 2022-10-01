import "@styles/globals.css";
import "react-day-picker/dist/style.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import UserProvider from "@context/user";
import AdminDataProvider from "@context/adminData";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <AdminDataProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AdminDataProvider>
    </UserProvider>
  );
}
