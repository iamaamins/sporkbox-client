import EmployeeManagement from './EmployeeManagement';
import Pricing from './Pricing';
import Restaurant from './Restaurant';

export default function Dashboard() {
  return (
    <>
      <EmployeeManagement />
      <Pricing />
      <Restaurant />
    </>
  );
}
