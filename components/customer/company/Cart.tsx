import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@context/User';
import { IoMdRemove } from 'react-icons/io';
import styles from '@components/customer/ordering/Cart.module.css';
import ButtonLoader from '@components/layout/ButtonLoader';
import {
  axiosInstance,
  dateToText,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
  getPayableAmount,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';
import {
  AppliedDiscount,
  CartItem,
  CustomAxiosError,
  Customer,
  CustomerOrder,
  Guest,
  Order,
} from 'types';
import { useData } from '@context/Data';

export default function Cart() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const { allUpcomingOrders, setAllUpcomingOrders } = useData();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [user, setUser] = useState<Customer | Guest>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allOrders, setAllOrders] = useState<{
    isLoading: boolean;
    data: CustomerOrder[];
  }>({ isLoading: true, data: [] });
  const [payableAmount, setPayableAmount] = useState<number>();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function applyDiscount(e: FormEvent) {
    e.preventDefault();
    try {
      setIsApplyingDiscount(true);
      const response = await axiosInstance.post(
        `/discount-code/apply/${discountCode}`
      );
      setAppliedDiscount(response.data);

      localStorage.setItem(
        `admin-discount-${user?._id}`,
        JSON.stringify(response.data)
      );
    } catch (err) {
      showErrorAlert('Invalid discount code', setAlerts);
    } finally {
      setIsApplyingDiscount(false);
    }
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    localStorage.removeItem(`admin-discount-${user?._id}`);
  }

  function removeItemFromCart(item: CartItem) {
    const updatedCartItems = cartItems.filter(
      (cartItem) =>
        !(
          cartItem._id === item._id &&
          cartItem.companyId === item.companyId &&
          cartItem.deliveryDate === item.deliveryDate
        )
    );
    setCartItems(updatedCartItems);
    localStorage.setItem(
      `admin-cart-${user?._id}`,
      JSON.stringify(updatedCartItems)
    );
  }

  async function checkout(discountCodeId?: string) {
    if (!user) return showErrorAlert('No user found', setAlerts);

    const orderItems = cartItems.map((cartItem) => ({
      itemId: cartItem._id,
      quantity: cartItem.quantity,
      companyId: cartItem.companyId,
      restaurantId: cartItem.restaurantId,
      deliveryDate: cartItem.deliveryDate,
      optionalAddons: cartItem.optionalAddons,
      requiredAddons: cartItem.requiredAddons,
      removedIngredients: cartItem.removableIngredients,
    }));

    try {
      setIsCheckingOut(true);
      const response = await axiosInstance.post(`/orders/create-orders`, {
        orderItems,
        discountCodeId,
        userId: user._id,
      });

      if (typeof response.data === 'string') {
        open(response.data);
      } else {
        localStorage.removeItem(`admin-cart-${user._id}`);
        localStorage.removeItem(`admin-discount-${user._id}`);

        setAllUpcomingOrders((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...response.data],
        }));

        showSuccessAlert('Orders placed', setAlerts);
        router.push('/admin/dashboard');
      }
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsCheckingOut(false);
    }
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

  // Get cart items
  useEffect(() => {
    if (router.isReady && isAdmin && user)
      setCartItems(
        JSON.parse(localStorage.getItem(`admin-cart-${user?._id}`) || '[]')
      );
  }, [isAdmin, user, router]);

  // Get all orders
  useEffect(() => {
    async function getAllOrders(userId: string, allUpcomingOrders: Order[]) {
      try {
        const response = await axiosInstance.get(
          `/orders/${userId}/all-delivered-orders`
        );

        const deliveredOrders = response.data;
        const upcomingOrders = allUpcomingOrders.filter(
          (upcomingOrder) => upcomingOrder.customer._id === userId
        );

        setAllOrders((prevState) => ({
          ...prevState,
          isLoading: false,
          data: [...upcomingOrders, ...deliveredOrders],
        }));
      } catch (err) {
        setAllOrders((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (router.isReady && isAdmin && user && !allUpcomingOrders.isLoading)
      getAllOrders(user._id, allUpcomingOrders.data);
  }, [isAdmin, user, allUpcomingOrders, router]);

  // Get payable amount
  useEffect(() => {
    if (
      cartItems.length &&
      user &&
      user.role !== 'GUEST' &&
      !allOrders.isLoading
    ) {
      const payableAmount = getPayableAmount(
        allOrders.data,
        cartItems,
        user,
        appliedDiscount?.value || 0
      );
      setPayableAmount(payableAmount);
    }
  }, [user, allOrders, cartItems, appliedDiscount]);

  // Get saved discount
  useEffect(() => {
    if (router.isReady && isAdmin && user) {
      const savedDiscount = localStorage.getItem(`admin-discount-${user._id}`);
      setAppliedDiscount(savedDiscount ? JSON.parse(savedDiscount) : null);
    }
  }, [isAdmin, user, router]);

  // Remove discount
  useEffect(() => {
    if (
      appliedDiscount &&
      payableAmount &&
      payableAmount <= 0 &&
      user &&
      user.role !== 'GUEST' &&
      !allOrders.isLoading
    )
      removeDiscount();
  }, [appliedDiscount, payableAmount, user, allOrders]);

  return (
    <section className={styles.cart}>
      {cartItems.length === 0 && <h2>No items in basket</h2>}
      {cartItems.length > 0 && (
        <>
          <h2 className={styles.cart_title}>Your basket</h2>
          <div className={styles.items}>
            {cartItems.map((cartItem, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.cover_image}>
                  <Image
                    src={cartItem.image}
                    height={2}
                    width={3}
                    layout='responsive'
                    objectFit='cover'
                    alt='Item image'
                  />
                  <div
                    className={styles.remove}
                    onClick={() => removeItemFromCart(cartItem)}
                  >
                    <IoMdRemove />
                  </div>
                </div>
                <Link
                  href={`/admin/dashboard/${user?._id}/place-order/${cartItem.deliveryDate}/${cartItem.shift}/${cartItem.restaurantId}/${cartItem._id}`}
                >
                  <a className={styles.item_details}>
                    <p className={styles.name}>
                      <span>{cartItem.quantity}</span> {cartItem.name}
                    </p>
                    <p className={styles.price}>
                      Total:{' '}
                      {numberToUSD(
                        cartItem.price * cartItem.quantity + cartItem.addonPrice
                      )}
                    </p>
                    <p className={styles.date}>
                      Delivery date:{' '}
                      <span>{dateToText(cartItem.deliveryDate)}</span> -{' '}
                      <span className={styles.shift}>{cartItem.shift}</span>
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
          {!appliedDiscount &&
            ((payableAmount && payableAmount > 0) ||
              user?.role === 'GUEST') && (
              <form
                onSubmit={applyDiscount}
                className={styles.apply_discount_form}
              >
                <label htmlFor='discountCode'>Discount code</label>
                <div>
                  <input
                    type='text'
                    id='discountCode'
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <input
                    type='submit'
                    value='Apply'
                    onClick={applyDiscount}
                    disabled={isApplyingDiscount || !discountCode}
                  />
                </div>
              </form>
            )}
          {appliedDiscount && (
            <div className={styles.applied_discount}>
              <p>
                <span>{appliedDiscount.code}</span> applied
              </p>
              <p onClick={removeDiscount}>Remove</p>
            </div>
          )}
          <button
            disabled={isCheckingOut}
            className={styles.button}
            onClick={() => checkout(appliedDiscount?._id)}
          >
            {isCheckingOut ? (
              <ButtonLoader />
            ) : payableAmount && payableAmount > 0 ? (
              `Checkout • ${numberToUSD(payableAmount)} USD`
            ) : (
              'Place order'
            )}
          </button>
        </>
      )}
    </section>
  );
}
