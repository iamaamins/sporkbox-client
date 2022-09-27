import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import AdminProvider from "../context/admin";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AdminProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AdminProvider>
    </>
  );
}
