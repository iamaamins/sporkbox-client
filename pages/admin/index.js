import { useEffect } from "react";
import { useUser } from "@context/user";
import { useRouter } from "next/router";
import { checkUser } from "@utils/index";
import Dashboard from "@components/admin/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {isAdmin && <Dashboard />}
    </main>
  );
}
