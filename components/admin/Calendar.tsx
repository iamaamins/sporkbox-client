import { useAlert } from '@context/Alert';
import { useUser } from '@context/User';
import {
  axiosInstance,
  dateToMS,
  getDate,
  getDay,
  numberToUSD,
  showErrorAlert,
} from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  CartItem,
  CustomAxiosError,
  Customer,
  Item,
  UpcomingRestaurant,
  UpcomingRestaurants,
} from 'types';
import styles from '@components/customer/Calendar.module.css';
import CalendarSort from '@components/customer/CalendarSort';
import Link from 'next/link';
import { RiShieldStarFill } from 'react-icons/ri';
import { IoIosArrowUp } from 'react-icons/io';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import ModalContainer from '@components/layout/ModalContainer';
import CalendarFiltersModal from '@components/customer/CalendarFiltersModal';
import CartIcon from '@components/layout/CartIcon';

export default function Calendar() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { isAdmin } = useUser();
  const [upcomingRestaurants, setUpcomingRestaurants] =
    useState<UpcomingRestaurants>({
      isLoading: true,
      data: [],
    });
  const [activeRestaurants, setActiveRestaurants] = useState<
    { id: string; show: boolean }[]
  >([]);
  const [restaurants, setRestaurants] = useState<UpcomingRestaurant[]>([]);
  const [updatedRestaurants, setUpdatedRestaurants] = useState<
    UpcomingRestaurant[]
  >([]);
  const [employee, setEmployee] = useState<Customer | null>(null);
  const [upcomingDates, setUpcomingDates] = useState<number[]>([]);
  const [showCalendarFilters, setShowCalendarFilters] = useState(false);
  const [sorted, setSorted] = useState({
    byLowToHigh: false,
    byHighToLow: false,
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function updateActiveRestaurants(restaurant: UpcomingRestaurant) {
    setActiveRestaurants((prevState) =>
      prevState.map((activeRestaurant) => {
        if (activeRestaurant.id === restaurant._id) {
          return {
            ...activeRestaurant,
            show: !activeRestaurant.show,
          };
        } else {
          return activeRestaurant;
        }
      })
    );
  }

  function isSoldOutItem(item: Item) {
    const company = employee?.companies.find(
      (company) => company.status === 'ACTIVE'
    );
    return item.soldOutStat?.some(
      (el) =>
        upcomingDates.includes(dateToMS(el.date)) && company?._id === el.company
    );
  }

  // Get cart items
  useEffect(() => {
    if (router.isReady && isAdmin && employee)
      setCartItems(
        JSON.parse(localStorage.getItem(`admin-cart-${employee?._id}`) || '[]')
      );
  }, [isAdmin, employee, router]);

  // Get employee details
  useEffect(() => {
    async function getEmployee(employee: string) {
      try {
        const response = await axiosInstance.get(`/customers/${employee}`);
        setEmployee(response.data);
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady && isAdmin) getEmployee(router.query.employee as string);
  }, [isAdmin, router.isReady]);

  // Get upcoming restaurants
  useEffect(() => {
    async function getUpcomingRestaurants(employee: string) {
      try {
        const response = await axiosInstance.get(
          `/restaurants/upcoming-restaurants/${employee}`
        );
        const upcomingRestaurants = response.data as UpcomingRestaurant[];
        setUpcomingRestaurants({ isLoading: false, data: upcomingRestaurants });
        setUpcomingDates(
          upcomingRestaurants.length
            ? upcomingRestaurants
                .filter(
                  (upcomingRestaurant) =>
                    upcomingRestaurant.schedule.status === 'ACTIVE'
                )
                .map((upcomingRestaurant) =>
                  dateToMS(upcomingRestaurant.schedule.date)
                )
                .filter((date, index, dates) => dates.indexOf(date) === index)
            : []
        );
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (router.isReady && isAdmin)
      getUpcomingRestaurants(router.query.employee as string);
  }, [isAdmin, router.isReady]);

  useEffect(() => {
    if (router.isReady && upcomingDates.length) {
      const upcomingDate = upcomingDates.find(
        (upcomingDate) => upcomingDate.toString() === router.query.date
      );

      if (upcomingDate) {
        const upcomingRestaurantsOnDate = upcomingRestaurants.data
          .filter(
            (upcomingRestaurant) =>
              dateToMS(upcomingRestaurant.schedule.date) === upcomingDate
          )
          .sort(
            (a, b) =>
              dateToMS(a.schedule.createdAt) - dateToMS(b.schedule.createdAt)
          )
          .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        const activeRestaurants = upcomingRestaurantsOnDate.map(
          (upcomingRestaurant) => ({
            id: upcomingRestaurant._id,
            show: true,
          })
        );

        setActiveRestaurants(activeRestaurants);
        setRestaurants(upcomingRestaurantsOnDate);
        setUpdatedRestaurants(upcomingRestaurantsOnDate);
      }
    }
  }, [upcomingDates, router]);

  // Select the first date by default
  useEffect(() => {
    if (
      upcomingDates.length &&
      !upcomingDates.includes(+(router.query.date as string))
    ) {
      const path = router.asPath;
      router.replace(path.replace(/\/date$/, `/${upcomingDates[0]}`));
    }
  }, [upcomingDates]);

  return (
    <>
      <section className={styles.calendar}>
        {upcomingRestaurants.isLoading && <h2>Loading...</h2>}
        {!upcomingRestaurants.isLoading && !upcomingRestaurants.data.length && (
          <h2>No restaurants</h2>
        )}
        {upcomingDates.length > 0 && (
          <>
            <div className={styles.header_and_controller}>
              <div className={styles.header}>
                <h2>Upcoming week</h2>
                <CalendarSort
                  setSorted={setSorted}
                  updatedRestaurants={updatedRestaurants}
                />
                <p
                  onClick={() => setShowCalendarFilters(true)}
                  className={`${styles.filter} ${
                    showCalendarFilters && styles.active
                  }`}
                >
                  Filter
                </p>
                <CartIcon
                  href={`/admin/dashboard/${employee?._id}/cart`}
                  totalCartQuantity={cartItems.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0
                  )}
                />
              </div>
              <div className={styles.controller}>
                {upcomingDates.map((upcomingDate, index) => (
                  <div key={index}>
                    <Link
                      href={`/admin/dashboard/${router.query.employee}/place-order/${upcomingDate}`}
                    >
                      <a
                        key={index}
                        className={
                          upcomingDate.toString() === router.query.date
                            ? styles.active
                            : ''
                        }
                      >
                        <span>{getDate(upcomingDate)}</span>
                        <span>{getDay(upcomingDate)}</span>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {updatedRestaurants.length > 0 ? (
              <>
                {updatedRestaurants.map((restaurant, index) => (
                  <div
                    key={index}
                    className={`${styles.restaurant} ${
                      restaurant.schedule.status === 'INACTIVE' &&
                      styles.sold_out
                    }`}
                  >
                    <h3
                      className={styles.restaurant_name}
                      onClick={() => updateActiveRestaurants(restaurant)}
                    >
                      {restaurant.name}
                      {restaurant.isFeatured && (
                        <RiShieldStarFill title='Featured restaurant' />
                      )}
                      {restaurant.schedule.status === 'INACTIVE' &&
                        '- sold out'}
                      <IoIosArrowUp
                        className={`${styles.restaurant_name_arrow} ${
                          activeRestaurants.some(
                            (activeRestaurant) =>
                              !activeRestaurant.show &&
                              activeRestaurant.id === restaurant._id
                          ) && styles.rotate_arrow
                        }`}
                      />
                    </h3>
                    {activeRestaurants.some(
                      (activeRestaurant) =>
                        activeRestaurant.show &&
                        activeRestaurant.id === restaurant._id
                    ) ? (
                      <div className={styles.items}>
                        {restaurant.items.map((item) => (
                          <Link
                            key={item._id}
                            href={
                              !isSoldOutItem(item) &&
                              restaurant.schedule.status === 'ACTIVE'
                                ? `/admin/dashboard/${router.query.employee}/place-order/${router.query.date}/${restaurant.company.shift}/${restaurant._id}/${item._id}`
                                : '#'
                            }
                          >
                            <a
                              className={`${styles.item} ${
                                isSoldOutItem(item) && styles.sold_out
                              }`}
                            >
                              <div className={styles.item_details}>
                                <p className={styles.item_name}>
                                  {item.name}
                                  {item.averageRating && (
                                    <span>
                                      <AiFillStar />
                                      {item.averageRating}
                                    </span>
                                  )}
                                </p>
                                <p className={styles.item_price}>
                                  {numberToUSD(item.price)}
                                </p>
                                <p className={styles.item_description}>
                                  {item.description}
                                </p>
                              </div>

                              <div className={styles.item_image}>
                                {item.popularityIndex && (
                                  <span className={styles.popularity_index}>
                                    #{item.popularityIndex} Most Liked
                                  </span>
                                )}
                                <span
                                  className={styles.item_image_overlay}
                                ></span>
                                <p className={styles.sold_out_text}>Sold out</p>
                                <Image
                                  src={item.image || restaurant.logo}
                                  width={16}
                                  height={10}
                                  objectFit='cover'
                                  layout='responsive'
                                />
                                {cartItems.map(
                                  (cartItem) =>
                                    cartItem.deliveryDate.toString() ===
                                      router.query.date &&
                                    cartItem._id === item._id &&
                                    cartItem.companyId ===
                                      restaurant.company._id && (
                                      <span
                                        key={item._id}
                                        className={styles.quantity}
                                      >
                                        {cartItem.quantity}
                                      </span>
                                    )
                                )}
                              </div>
                            </a>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.message}>Items are collapsed!</p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p className={styles.message}>No items found</p>
            )}
          </>
        )}
      </section>
      <ModalContainer
        width='20rem'
        showModalContainer={showCalendarFilters}
        setShowModalContainer={setShowCalendarFilters}
        component={
          <CalendarFiltersModal
            customer={employee}
            restaurants={restaurants}
            setUpdatedRestaurants={setUpdatedRestaurants}
            setShowCalendarFilters={setShowCalendarFilters}
          />
        }
      />
    </>
  );
}
