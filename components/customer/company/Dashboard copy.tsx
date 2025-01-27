import UserManagement from './UserManagement';
import Pricing from './Pricing';
import Restaurant from './Restaurant';

export default function Dashboard() {
  return (
    <>
      <UserManagement />
      <Pricing />
      <Restaurant />
    </>
  );
}
