import Cart from "@components/generic/Cart";
import PageLoader from "@components/layout/PageLoader";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CartPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <Cart />}
    </main>
  );
}
