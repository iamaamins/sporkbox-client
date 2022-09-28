import "@styles/globals.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import AdminProvider from "@context/admin";
import LoaderProvider from "@context/loader";

export default function App({ Component, pageProps }) {
  return (
    <LoaderProvider>
      <AdminProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AdminProvider>
    </LoaderProvider>
  );
}
