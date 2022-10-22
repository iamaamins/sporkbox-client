import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Favorite from "@components/generic/Favorite";
import PageLoader from "@components/layout/PageLoader";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isLoading, isCustomer, router);
  }, [isLoading, isCustomer]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isCustomer && <Favorite />}
    </main>
  );
}
