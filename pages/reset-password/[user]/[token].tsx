import { useEffect } from "react";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import PageLoader from "@components/layout/PageLoader";
import ResetPassword from "@components/generic/ResetPassword";

export default function PassWordResetPage() {
  // Hooks
  const router = useRouter();
  const { isUserLoading, isAdmin, isCustomer } = useUser();

  // Push to a page depending on user role
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    } else if (isCustomer) {
      router.push("/dashboard");
    }
  }, [isAdmin, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {!isUserLoading && <ResetPassword />}
    </main>
  );
}
