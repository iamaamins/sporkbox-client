import OrdersGroups from './OrdersGroups';
import { useData } from '@context/Data';
import ScheduledRestaurants from './ScheduledRestaurants';

export default function Dashboard() {
  const { upcomingOrderGroups, scheduledRestaurants } = useData();

  return (
    <>
      <OrdersGroups
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
