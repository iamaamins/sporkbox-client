import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Customer from "@components/admin/Customer";
import PageLoader from "@components/layout/PageLoader";

export default function CustomerPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <Customer />}
    </main>
  );
}
