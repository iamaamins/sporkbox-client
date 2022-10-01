import { useEffect } from "react";
import { useUser } from "@context/user";
import { useRouter } from "next/router";
import LoginForm from "@components/login/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isAdmin, isCustomer } = useUser();

  // Push to a page depending on user role
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    } else if (isCustomer) {
      router.push("/");
    }
  }, [isAdmin, isCustomer]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && <LoginForm />}
    </main>
  );
}
