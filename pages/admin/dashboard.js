import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { useRouter } from "next/router";
import Dashboard from "@components/admin/dashboard";
import { checkAdmin } from "@utils/index";

export default function DashboardPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { loading } = useLoader();

  useEffect(() => {
    checkAdmin(loading, admin, router);
  }, [loading, admin]);

  return (
    <main>
      {loading && <div>Loading...</div>}
      {!loading && admin && <Dashboard />}
    </main>
  );
}
