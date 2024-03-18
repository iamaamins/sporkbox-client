import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { axiosInstance, numberToUSD, showErrorAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import { useUser } from '@context/User';
import { useCart } from '@context/Cart';
import { useAlert } from '@context/Alert';
import { AiFillCheckCircle } from 'react-icons/ai';
import styles from './CheckoutSuccess.module.css';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const { setCartItems } = useCart();
  const [paidAmount, setPaidAmount] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function getCheckoutSessionData() {
    try {
      const response = await axiosInstance.get(
        `/stripe/session/${router.query.session}`
      );
      setPaidAmount(response.data);
      setCartItems([]);
      localStorage.removeItem(`cart-${customer?._id}`);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getCheckoutSessionData();
      localStorage.removeItem(`discount-${customer?._id}`);
    }
  }, [router.isReady]);

  return (
    <section className={styles.checkout_success}>
      {isLoading && <h2> Loading...</h2>}

      {!isLoading && !paidAmount && <h2>Invalid or expired session id</h2>}

      {paidAmount && (
        <>
          <div className={styles.confirmation}>
            <h2>
              Payment confirmed <AiFillCheckCircle />
            </h2>
            <p>Your orders are being processed.</p>
          </div>

          <div className={styles.details}>
            <p>Total amount paid</p>
            <p>{numberToUSD(paidAmount / 100)}</p>
          </div>
        </>
      )}
    </section>
  );
}
