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
  getPayableAmount,
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
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [payableAmount, setPayableAmount] = useState<number>();
  const { customerUpcomingOrders, customerDeliveredOrders } = useData();
  const [allOrders, setAllOrders] = useState<{
    isLoading: boolean;
    data: CustomerOrder[];
  }>({ isLoading: true, data: [] });
  const { cartItems, isLoading, checkout, removeItemFromCart } = useCart();

  async function applyDiscount(e: FormEvent) {
    e.preventDefault();

    try {
      setIsApplyingDiscount(true);
      const response = await axiosInstance.post(
        `/discount-code/apply/${discountCode}`
      );
      setAppliedDiscount(response.data);
      localStorage.setItem(
        `discount-${customer?._id}`,
        JSON.stringify(response.data)
      );
    } catch (err) {
      console.log(err);
      showErrorAlert('Invalid discount code', setAlerts);
    } finally {
      setIsApplyingDiscount(false);
    }
  }

  function removeDiscount() {
    setAppliedDiscount(null);
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
      const payableAmount = getPayableAmount(
        allOrders.data,
        cartItems,
        customer,
        appliedDiscount?.value || 0
      );
      setPayableAmount(payableAmount);
    }
  }, [customer, allOrders, cartItems, appliedDiscount]);

  // Get saved discount
  useEffect(() => {
    if (router.isReady && customer) {
      const savedDiscount = localStorage.getItem(`discount-${customer._id}`);
      setAppliedDiscount(savedDiscount ? JSON.parse(savedDiscount) : null);
    }
  }, [customer, router]);

  // Remove discount
  useEffect(() => {
    if (
      appliedDiscount &&
      payableAmount &&
      payableAmount <= 0 &&
      !allOrders.isLoading
    )
      removeDiscount();
  }, [appliedDiscount, payableAmount, allOrders]);

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
          {!appliedDiscount && payableAmount && payableAmount > 0 && (
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
            disabled={isLoading}
            className={styles.button}
            onClick={() => checkout(appliedDiscount?._id)}
          >
            {isLoading ? (
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
