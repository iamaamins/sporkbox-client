import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  axiosInstance,
  formatCurrencyToUSD,
  showErrorAlert,
} from "@utils/index";
import { AxiosError } from "axios";
import { IAxiosError } from "types";
import { useAlert } from "@context/Alert";
import { AiFillCheckCircle } from "react-icons/ai";
import styles from "@styles/generic/CheckoutSuccess.module.css";

export default function CheckoutSuccess() {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
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
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
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
