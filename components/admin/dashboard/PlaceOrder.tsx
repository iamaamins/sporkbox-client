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
  Guest,
  UpcomingRestaurant,
  UpcomingRestaurants,
} from 'types';
import styles from '@components/customer/ordering/PlaceOrder.module.css';
import SortAndFilterByPrice from '@components/customer/ordering/SortAndFilterByPrice';
import Link from 'next/link';
import { RiShieldStarFill } from 'react-icons/ri';
import { IoIosArrowUp } from 'react-icons/io';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import FilterByDietaryTags from '@components/customer/ordering/FilterByDietaryTags';
import CartIcon from '@components/layout/CartIcon';

export default function PlaceOrder() {
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
  const [user, setUser] = useState<Customer | Guest | null>(null);
  const [upcomingDates, setUpcomingDates] = useState<number[]>([]);
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

  // Get user details
  useEffect(() => {
    async function getUser(userId: string) {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);

        setUser(response.data);
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady && isAdmin) getUser(router.query.user as string);
  }, [isAdmin, router]);

  // Get upcoming restaurants and dates
  useEffect(() => {
    async function getUpcomingRestaurantsAndDates(userId: string) {
      try {
        const response = await axiosInstance.get(
          `/restaurants/upcoming/${userId}`
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
        setUpcomingRestaurants((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (router.isReady && isAdmin)
      getUpcomingRestaurantsAndDates(router.query.user as string);
  }, [isAdmin, router]);

  // Get restaurants
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

  // Get cart items
  useEffect(() => {
    if (router.isReady && isAdmin && user)
      setCartItems(
        JSON.parse(localStorage.getItem(`admin-cart-${user?._id}`) || '[]')
      );
  }, [isAdmin, user, router]);

  return (
    <section className={styles.container}>
      {upcomingRestaurants.isLoading && <h2>Loading...</h2>}
      {!upcomingRestaurants.isLoading && !upcomingDates.length && (
        <h2>No restaurants</h2>
      )}
      {upcomingDates.length > 0 && (
        <>
          <div className={styles.header_and_controller}>
            <div className={styles.header}>
              <div className={styles.title_and_sort}>
                <h2>Upcoming meals</h2>
                <SortAndFilterByPrice
                  restaurants={restaurants}
                  setUpdatedRestaurants={setUpdatedRestaurants}
                />
              </div>
              <FilterByDietaryTags
                isCompanyAdmin={true}
                user={user}
                restaurants={restaurants}
                setUpdatedRestaurants={setUpdatedRestaurants}
              />
              <CartIcon
                href={`/admin/dashboard/${user?._id}/cart`}
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
                    href={`/admin/dashboard/${router.query.user}/place-order/${upcomingDate}`}
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
                    restaurant.schedule.status === 'INACTIVE' && styles.sold_out
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
                    {restaurant.schedule.status === 'INACTIVE' && '- sold out'}
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
                            restaurant.schedule.status !== 'ACTIVE'
                              ? '#'
                              : `/admin/dashboard/${router.query.user}/place-order/${router.query.date}/${restaurant.company.shift}/${restaurant._id}/${item._id}`
                          }
                        >
                          <a className={styles.item}>
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
  );
}
