import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { axiosInstance, numberToUSD, showErrorAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { AiFillCheckCircle } from 'react-icons/ai';
import styles from './CheckoutSuccess.module.css';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [paidAmount, setPaidAmount] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function getCheckoutSessionData() {
    try {
      const response = await axiosInstance.get(
        `/stripe/session/${router.query.session}`
      );

      setPaidAmount(response.data);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  function removeSavedData() {
    const userId = router.query.userId;

    localStorage.removeItem(`cart-${userId}`);
    localStorage.removeItem(`discount-${userId}`);

    localStorage.removeItem(`company-admin-cart-${userId}`);
    localStorage.removeItem(`company-admin-discount-${userId}`);

    localStorage.removeItem(`admin-cart-${userId}`);
    localStorage.removeItem(`admin-discount-${userId}`);
  }

  useEffect(() => {
    if (router.isReady) {
      getCheckoutSessionData();
      removeSavedData();
    }
  }, [router.isReady]);

  return (
    <section className={styles.checkout_success}>
      {isLoading ? (
        <h2> Loading...</h2>
      ) : !paidAmount ? (
        <h2>Invalid or expired session id</h2>
      ) : (
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
