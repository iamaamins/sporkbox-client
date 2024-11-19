import OrderGroups from '../home/OrderGroups';
import { useData } from '@context/Data';
import ScheduledRestaurants from '../home/ScheduledRestaurants';

export default function Home() {
  const { upcomingOrderGroups, scheduledRestaurants } = useData();

  return (
    <>
      <OrderGroups
        slug='upcoming-orders'
        title='Upcoming orders'
        orderGroups={upcomingOrderGroups}
      />
      <ScheduledRestaurants
        restaurants={scheduledRestaurants.data}
        isLoading={scheduledRestaurants.isLoading}
      />
    </>
  );
}
