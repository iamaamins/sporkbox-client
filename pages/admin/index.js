import { useEffect } from "react";
import { useLoader } from "@context/loader";
import { useUser } from "@context/user";
import { useRouter } from "next/router";
import LoginForm from "@components/admin/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  // If not loading and admin
  // then push to the dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && <LoginForm />}
    </main>
  );
}
