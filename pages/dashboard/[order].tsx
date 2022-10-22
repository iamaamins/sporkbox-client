import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Order from "@components/generic/Order";
import PageLoader from "@components/layout/PageLoader";

export default function OrderPage() {
  const router = useRouter();
  const { isLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isLoading, isCustomer, router);
  }, [isLoading, isCustomer]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isCustomer && <Order />}
    </main>
  );
}
