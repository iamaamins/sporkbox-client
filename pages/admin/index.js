import { useEffect } from "react";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import { checkUser } from "@utils/index";
import Dashboard from "@components/admin/Dashboard";
import PageLoader from "@components/layout/PageLoader";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isAdmin && <Dashboard />}
    </main>
  );
}
