import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstance, formatCurrencyToUSD } from "@utils/index";

export default function CheckoutSuccess() {
  // Hooks
  const router = useRouter();
  const [paidAmount, setPaidAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      getCheckoutSessionData();
    }
  }, [router.isReady]);

  // Get session data
  async function getCheckoutSessionData() {
    try {
      // Show loader
      setIsLoading(true);

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
    <section>
      {isLoading && <h2> Loading...</h2>}

      {!isLoading && !paidAmount && <h2>Please provide a valid session id</h2>}

      {paidAmount && (
        <h2>
          Thanks for paying {formatCurrencyToUSD(paidAmount / 100)}. Your orders
          are being processed.
        </h2>
      )}
    </section>
  );
}
