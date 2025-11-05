import UserManagement from './UserManagement';
import Pricing from './Pricing';
import Restaurant from './Restaurant';
import Review from './Review';
import IssueFeedback from './IssueFeedback';
import GeneralFeedback from './GeneralFeedback';

export default function Dashboard() {
  return (
    <>
      <UserManagement />
      <Pricing />
      <Review />
      <Restaurant />
      <IssueFeedback />
      <GeneralFeedback />
    </>
  );
}
