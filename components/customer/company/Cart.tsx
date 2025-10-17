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
  getTotalPayable,
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
} from 'types';

export default function Cart() {
  const router = useRouter();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [discountCode, setDiscountCode] = useState('');
  const [user, setUser] = useState<Customer | Guest>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allOrders, setAllOrders] = useState<{
    isLoading: boolean;
    data: CustomerOrder[];
  }>({ isLoading: true, data: [] });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [payable, setPayable] = useState({ has: true, net: 0, total: 0 });
  const [discount, setDiscount] = useState<{
    isApplying: boolean;
    data: AppliedDiscount | null;
  }>({ isApplying: false, data: null });

  async function applyDiscount(e: FormEvent) {
    e.preventDefault();

    try {
      setDiscount((prevState) => ({ ...prevState, isApplying: true }));

      const response = await axiosInstance.post(
        `/discount-code/apply/${discountCode}`
      );

      setDiscount((prevState) => ({ ...prevState, data: response.data }));

      localStorage.setItem(
        `company-admin-discount-${user?._id}`,
        JSON.stringify(response.data)
      );
    } catch (err) {
      showErrorAlert('Invalid discount code', setAlerts);
    } finally {
      setDiscount((prevState) => ({ ...prevState, isApplying: false }));
    }
  }

  function removeDiscount() {
    setDiscount((prevState) => ({ ...prevState, data: null }));
    localStorage.removeItem(`company-admin-discount-${user?._id}`);
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
      `company-admin-cart-${user?._id}`,
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
      requiredAddonsOne: cartItem.requiredAddonsOne,
      requiredAddonsTwo: cartItem.requiredAddonsTwo,
      removedIngredients: cartItem.removableIngredients,
    }));

    try {
      setIsCheckingOut(true);

      const response = await axiosInstance.post(`/orders/create`, {
        orderItems,
        discountCodeId,
        orderingForUser: { id: user._id },
      });

      if (typeof response.data === 'string') {
        location.replace(response.data);
      } else {
        localStorage.removeItem(`company-admin-cart-${user._id}`);
        localStorage.removeItem(`company-admin-discount-${user._id}`);

        showSuccessAlert('Orders placed', setAlerts);
        router.push('/company');
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
    if (router.isReady && customer) getUser(router.query.user as string);
  }, [customer, router]);

  // Get cart items
  useEffect(() => {
    if (router.isReady && customer && user)
      setCartItems(
        JSON.parse(
          localStorage.getItem(`company-admin-cart-${user._id}`) || '[]'
        )
      );
  }, [customer, user, router]);

  // Get all orders
  useEffect(() => {
    async function getAllOrders(userId: string, customer: Customer) {
      try {
        const response = await axiosInstance.get(
          `/users/${customer.companies[0].code}/${userId}/data`
        );

        setAllOrders((prevState) => ({
          ...prevState,
          isLoading: false,
          data: [
            ...response.data.upcomingOrders,
            ...response.data.deliveredOrders,
          ],
        }));
      } catch (err) {
        setAllOrders((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    if (router.isReady && customer && user) getAllOrders(user._id, customer);
  }, [customer, user, router]);

  // Get payable amount
  useEffect(() => {
    if (
      user &&
      user.role !== 'GUEST' &&
      cartItems.length &&
      !allOrders.isLoading
    ) {
      const totalPayable = getTotalPayable(allOrders.data, cartItems, user);

      setPayable({
        has: !!totalPayable,
        total: totalPayable,
        net: totalPayable - (discount.data?.value || 0),
      });
    }
  }, [user, allOrders, cartItems, discount]);

  // Get saved discount
  useEffect(() => {
    if (router.isReady && customer && user) {
      const savedDiscount = localStorage.getItem(
        `company-admin-discount-${user._id}`
      );

      setDiscount((prevState) => ({
        ...prevState,
        data: savedDiscount ? JSON.parse(savedDiscount) : null,
      }));
    }
  }, [customer, user, router]);

  // Remove discount
  useEffect(() => {
    if (
      user &&
      user.role !== 'GUEST' &&
      discount.data &&
      !payable.has &&
      !allOrders.isLoading
    )
      removeDiscount();
  }, [user, allOrders, discount, payable]);

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
                  href={`/company/${user?._id}/place-order/${cartItem.deliveryDate}/${cartItem.shift}/${cartItem.restaurantId}/${cartItem._id}`}
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
          {!discount.data && (payable.total > 0 || user?.role === 'GUEST') && (
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
                  disabled={discount.isApplying || !discountCode}
                />
              </div>
            </form>
          )}
          {discount.data && (
            <div className={styles.applied_discount}>
              <p>
                <span>{discount.data.code}</span> applied
              </p>
              <p onClick={removeDiscount}>Remove</p>
            </div>
          )}
          <button
            disabled={isCheckingOut}
            className={styles.button}
            onClick={() => checkout(discount.data?._id)}
          >
            {isCheckingOut ? (
              <ButtonLoader />
            ) : payable.net > 0 ? (
              `Checkout • ${numberToUSD(payable.net)} USD`
            ) : (
              'Place order'
            )}
          </button>
        </>
      )}
    </section>
  );
}
