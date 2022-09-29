import { useEffect } from "react";
import { useLoader } from "@context/loader";
import { useAdmin } from "@context/admin";
import { useRouter } from "next/router";
import LoginForm from "@components/admin/login/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { admin } = useAdmin();
  const { loading } = useLoader();

  useEffect(() => {
    if (admin) {
      router.push("/admin/dashboard");
    }
  }, [admin]);

  // If there is an admin then show the dashboard
  return (
    <main>
      {loading && <div>Loading...</div>}
      {!loading && !admin && <LoginForm />}
    </main>
  );
}
