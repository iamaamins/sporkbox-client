import { useLoader } from "@context/loader";
import { useAdmin } from "@context/admin";
import Dashboard from "@components/admin/dashboard";
import LoginForm from "@components/admin/login/LoginForm";

export default function LoginPage() {
  const { admin } = useAdmin();
  const { loading } = useLoader();

  // If loading then show loader
  if (loading) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    );
  }

  // If there is no admin then
  // show the login form
  if (!admin) {
    <main>
      <LoginForm />
    </main>;
  }

  // If there is an admin then show the dashboard
  return <main>{admin && <Dashboard />}</main>;
}
