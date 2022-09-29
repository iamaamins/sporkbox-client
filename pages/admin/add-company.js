import { useAdmin } from "@context/admin";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AddCompanyPage() {
  const router = useRouter();
  const { admin } = useAdmin();
  const { loading } = useLoader();

  useEffect(() => {
    checkAdmin(loading, admin, router);
  }, [loading, admin]);

  return (
    <main>
      {loading && <h1>Loading...</h1>}
      {admin && <div>Add a company</div>}
    </main>
  );
}
