import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageLoader from "@components/layout/PageLoader";
import AddCompany from "@components/admin/AddCompany";

export default function AddCompanyPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isAdmin && <AddCompany />}
    </main>
  );
}
