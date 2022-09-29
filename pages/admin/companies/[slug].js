import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import Company from "@components/admin/Company";

export default function CompanyPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkAdmin(isLoading, admin, router);
  }, [admin]);

  return (
    <main>
      {!admin && <div>Loading...</div>}
      {admin && <Company />}
    </main>
  );
}
