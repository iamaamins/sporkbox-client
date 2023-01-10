import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import PageLoader from "@components/layout/PageLoader";
import CheckoutSuccess from "@components/generic/CheckoutSuccess";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <CheckoutSuccess />}
    </main>
  );
}
