import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@styles/generic/CheckoutSuccess.module.css";
import { axiosInstance, formatCurrencyToUSD } from "@utils/index";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";

export default function CheckoutSuccess() {
  // Hooks
  const router = useRouter();
  const [paidAmount, setPaidAmount] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      getCheckoutSessionData();
    }
  }, [router.isReady]);

  // Get session data
  async function getCheckoutSessionData() {
    try {
      // Make request to the backend
      const response = await axiosInstance.get(
        `/stripe/session/${router.query.session}`
      );

      // Update state
      setPaidAmount(response.data);
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

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
            <p>{formatCurrencyToUSD(paidAmount / 100)}</p>
          </div>
        </>
      )}
    </section>
  );
}
