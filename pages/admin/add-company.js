import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AddCompany from "@components/admin/AddCompany";

export default function AddCompanyPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkAdmin(isLoading, admin, router);
  }, [admin]);

  return (
    <main>
      {!admin && <h1>Loading...</h1>}
      {admin && <AddCompany />}
    </main>
  );
}
