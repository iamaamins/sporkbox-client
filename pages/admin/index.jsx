import { useAdmin } from "@context/admin";
import ContactForm from "@components/admin/login/ContactForm";

export default function LoginPage() {
  const { admin } = useAdmin();

  console.log(admin);

  return (
    <main>
      <ContactForm />
    </main>
  );
}
