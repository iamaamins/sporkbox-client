import { useAdmin } from "@context/admin";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AllOrdersPage() {
  const router = useRouter();
  const { admin } = useAdmin();
  const { loading } = useLoader();

  useEffect(() => {
    checkAdmin(loading, admin, router);
  }, [loading, admin]);

  return (
    <main>
      {loading && <div>Loading...</div>}
      {!loading && admin && <div> AllOrdersPage</div>}
    </main>
  );
}
