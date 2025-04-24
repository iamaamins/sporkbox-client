import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@context/Cart';
import { useUser } from '@context/User';
import { IoMdRemove } from 'react-icons/io';
import styles from './Cart.module.css';
import ButtonLoader from '@components/layout/ButtonLoader';
import {
  axiosInstance,
  dateToText,
  numberToUSD,
  showErrorAlert,
  getTotalPayable,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { AppliedDiscount, CustomerOrder } from 'types';

export default function Cart() {
  const router = useRouter();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [discountCode, setDiscountCode] = useState('');
  const { customerUpcomingOrders, customerDeliveredOrders } = useData();
  const [allOrders, setAllOrders] = useState<{
    isLoading: boolean;
    data: CustomerOrder[];
  }>({ isLoading: true, data: [] });
  const { cartItems, isCheckingOut, checkout, removeItemFromCart } = useCart();
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
        `discount-${customer?._id}`,
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
    localStorage.removeItem(`discount-${customer?._id}`);
  }

  // Get all orders
  useEffect(() => {
    if (
      !customerUpcomingOrders.isLoading &&
      !customerDeliveredOrders.isLoading
    ) {
      setAllOrders({
        isLoading: false,
        data: [...customerUpcomingOrders.data, ...customerDeliveredOrders.data],
      });
    }
  }, [customerUpcomingOrders, customerDeliveredOrders]);

  // Get payable amount
  useEffect(() => {
    if (cartItems.length && customer && !allOrders.isLoading) {
      const totalPayable = getTotalPayable(allOrders.data, cartItems, customer);

      setPayable({
        has: !!totalPayable,
        total: totalPayable,
        net: totalPayable - (discount.data?.value || 0),
      });
    }
  }, [customer, allOrders, cartItems, discount]);

  // Get saved discount
  useEffect(() => {
    if (router.isReady && customer) {
      const savedDiscount = localStorage.getItem(`discount-${customer._id}`);

      setDiscount((prevState) => ({
        ...prevState,
        data: savedDiscount ? JSON.parse(savedDiscount) : null,
      }));
    }
  }, [customer, router]);

  // Remove discount
  useEffect(() => {
    if (discount.data && !payable.has && !allOrders.isLoading) removeDiscount();
  }, [discount, payable, allOrders]);

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
                  href={`/place-order/${cartItem.deliveryDate}/${cartItem.shift}/${cartItem.restaurantId}/${cartItem._id}`}
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
          {!discount.data && payable.total > 0 && (
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
