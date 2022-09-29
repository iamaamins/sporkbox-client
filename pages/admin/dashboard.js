import { useEffect } from "react";
import { useAdmin } from "@context/admin";
import { useLoader } from "@context/loader";
import { useRouter } from "next/router";
import Dashboard from "@components/admin/dashboard";
import { checkAdmin } from "@utils/index";

export default function DashboardPage() {
  const router = useRouter();
  const { admin } = useAdmin();
  const { loading } = useLoader();

  useEffect(() => {
    checkAdmin(loading, admin, router);
  }, [loading, admin]);

  return (
    <main>
      <Dashboard />
    </main>
  );
}
