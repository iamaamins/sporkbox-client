import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { useRouter } from "next/router";
import { checkAdmin } from "@utils/index";
import Dashboard from "@components/admin/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkAdmin(isLoading, admin, router);
  }, [admin]);

  return (
    <main>
      {!admin && <h1>Loading...</h1>}
      {admin && <Dashboard />}
    </main>
  );
}
