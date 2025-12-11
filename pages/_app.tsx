import './globals.css';
import Head from 'next/head';
import UserProvider from '@context/User';
import DataProvider from '@context/Data';
import CartProvider from '@context/Cart';
import type { AppProps } from 'next/app';
import AlertProvider from '@context/Alert';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import PromoBanner from '@components/layout/PromoBanner';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
      </Head>
      <AlertProvider>
        <UserProvider>
          <DataProvider>
            <CartProvider>
              <PromoBanner />
              <Header />
              <Component {...pageProps} />
              <Footer />
            </CartProvider>
          </DataProvider>
        </UserProvider>
      </AlertProvider>
    </>
  );
}
