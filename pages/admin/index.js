import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { useRouter } from "next/router";
import { checkUser } from "@utils/index";
import Dashboard from "@components/admin/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {!isAdmin && <h1>Loading...</h1>}
      {isAdmin && <Dashboard />}
    </main>
  );
}
