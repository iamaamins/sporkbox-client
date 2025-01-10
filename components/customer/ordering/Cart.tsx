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
  getAddonsTotal,
  showErrorAlert,
  getDateTotal,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';

type AppliedDiscount = {
  _id: string;
  code: string;
  value: number;
};

export default function Cart() {
  const router = useRouter();
  const {
    cartItems,
    isLoading,
    checkout,
    removeItemFromCart,
    upcomingOrderDetails,
  } = useCart();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  let payableAmount = 0;
  if (customer) {
    const cartDateTotalDetails = cartItems.map((cartItem) => {
      const optionalAddonsPrice = getAddonsTotal(cartItem.optionalAddons);
      const requiredAddonsPrice = getAddonsTotal(cartItem.requiredAddons);
      const totalAddonsPrice =
        (optionalAddonsPrice || 0) + (requiredAddonsPrice || 0);

      return {
        date: cartItem.deliveryDate,
        total: (cartItem.price + totalAddonsPrice) * cartItem.quantity,
      };
    });

    const cartItemDetails = getDateTotal(cartDateTotalDetails);
    const company = customer.companies.find(
      (company) => company.status === 'ACTIVE'
    );

    if (company) {
      const shiftBudget = company.shiftBudget;
      const totalPayableAmount = cartItemDetails
        .map((cartItemDetail) => {
          if (
            !upcomingOrderDetails.some(
              (upcomingOrderDetail) =>
                upcomingOrderDetail.date === cartItemDetail.date
            )
          ) {
            return {
              date: cartItemDetail.date,
              payable: cartItemDetail.total - shiftBudget,
            };
          } else {
            const upcomingOrderDetail = upcomingOrderDetails.find(
              (upcomingOrderDetail) =>
                upcomingOrderDetail.date === cartItemDetail.date
            );
            const upcomingDayOrderTotal = upcomingOrderDetail?.total || 0;

            return {
              date: cartItemDetail.date,
              payable:
                upcomingDayOrderTotal >= shiftBudget
                  ? cartItemDetail.total
                  : cartItemDetail.total -
                    (shiftBudget - upcomingDayOrderTotal),
            };
          }
        })
        .filter((detail) => detail.payable > 0)
        .reduce((acc, curr) => acc + curr.payable, 0);

      const discountAmount = appliedDiscount?.value || 0;
      payableAmount = totalPayableAmount - discountAmount;
    }
  }

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

  // Remove discount
  useEffect(() => {
    if (appliedDiscount && payableAmount <= 0) removeDiscount();
  }, [cartItems]);

  // Get saved discount
  useEffect(() => {
    const localDiscount = localStorage.getItem(`discount-${customer?._id}`);
    setAppliedDiscount(localDiscount ? JSON.parse(localDiscount) : null);
  }, [customer, router.isReady]);

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
          {!appliedDiscount && payableAmount > 0 && (
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
            ) : payableAmount > 0 ? (
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
