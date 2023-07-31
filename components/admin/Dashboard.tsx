import OrdersGroups from './OrdersGroups';
import { useData } from '@context/Data';
import ScheduledRestaurants from './ScheduledRestaurants';

export default function Dashboard() {
  const { upcomingOrdersGroups, scheduledRestaurants } = useData();

  return (
    <>
      {/* Active orders groups */}
      <OrdersGroups
        slug='upcoming-orders'
        title='Upcoming orders'
        ordersGroups={upcomingOrdersGroups}
      />

      {/* Scheduled restaurants */}
      <ScheduledRestaurants
        restaurants={scheduledRestaurants.data}
        isLoading={scheduledRestaurants.isLoading}
      />
    </>
  );
}
