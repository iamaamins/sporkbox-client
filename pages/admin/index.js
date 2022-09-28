import { useLoader } from "@context/loader";
import { useAdmin } from "@context/admin";
import Dashboard from "@components/admin/dashboard";
import LoginForm from "@components/admin/login/LoginForm";

export default function LoginPage() {
  const { admin } = useAdmin();
  const { loading } = useLoader();

  console.log(loading, admin);

  // If there is an admin then show the dashboard
  return (
    <main>
      {loading && <div>Loading...</div>}
      {!loading && !admin && <LoginForm />}
      {!loading && admin && <Dashboard />}
    </main>
  );
}
