import UserManagement from './UserManagement';
import Pricing from './Pricing';
import Restaurant from './Restaurant';
import Review from './Review';
import Issues from './Issues';

export default function Dashboard() {
  return (
    <>
      <UserManagement />
      <Pricing />
      <Review />
      <Restaurant />
      <Issues />
    </>
  );
}
