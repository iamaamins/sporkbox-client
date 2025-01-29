import UserManagement from './UserManagement';
import Pricing from './Pricing';
import Restaurant from './Restaurant';
import Review from './Review';

export default function Dashboard() {
  return (
    <>
      <UserManagement />
      <Pricing />
      <Review />
      <Restaurant />
    </>
  );
}
