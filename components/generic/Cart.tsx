import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@context/Cart';
import { useUser } from '@context/User';
import { IoMdRemove } from 'react-icons/io';
import styles from '@styles/generic/Cart.module.css';
import ButtonLoader from '@components/layout/ButtonLoader';
import {
  axiosInstance,
  convertDateToText,
  formatCurrencyToUSD,
  showErrorAlert,
} from '@utils/index';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';

type AppliedDiscount = {
  _id: string;
  code: string;
  value: number;
};

export default function Cart() {
  // Hooks
  const router = useRouter();
  const {
    cartItems,
    isLoading,
    checkoutCart,
    totalCartPrice,
    removeItemFromCart,
    upcomingOrdersTotal,
  } = useCart();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Payable amount
  let payableAmount = 0;

  // Get payable amount
  if (customer) {
    // Get company
    const company = customer.companies.find(
      (company) => company.status === 'ACTIVE'
    );

    // Get number of cart days
    const cartDays = cartItems
      .map((cartItem) => cartItem.deliveryDate)
      .filter((date, index, dates) => dates.indexOf(date) === index).length;

    if (company) {
      // Get shift budget
      const shiftBudget = company.shiftBudget;

      const allShiftBudget = shiftBudget * cartDays;

      // Check if the customer has stipend
      const hasStipend = allShiftBudget > upcomingOrdersTotal;

      // Get the discount amount
      const discountAmount = appliedDiscount?.value || 0;

      // Get cart total without the discount amount
      const cartTotalWithoutDiscount = totalCartPrice - discountAmount;

      if (hasStipend) {
        // Get stipend amount
        const stipendAmount = allShiftBudget - upcomingOrdersTotal;

        payableAmount = cartTotalWithoutDiscount - stipendAmount;
      } else {
        payableAmount = cartTotalWithoutDiscount;
      }
    }
  }

  // Handle apply discount code
  async function applyDiscount(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsApplyingDiscount(true);

      // Make request to the backend
      const response = await axiosInstance.post(
        `/discount-code/apply/${discountCode}`
      );

      // Update state
      setAppliedDiscount(response.data);

      // Save discount details to local storage
      localStorage.setItem(
        `discount-${customer?._id}`,
        JSON.stringify(response.data)
      );
    } catch (err) {
      // Log error
      console.log(err);

      showErrorAlert('Invalid discount code', setAlerts);
    } finally {
      // Remove loader
      setIsApplyingDiscount(false);
    }
  }

  // Handle remove discount
  function removeDiscount() {
    setAppliedDiscount(null);
    localStorage.removeItem(`discount-${customer?._id}`);
  }

  // Auto remove discount code
  useEffect(() => {
    if (appliedDiscount && payableAmount <= 0) {
      removeDiscount();
    }
  }, [cartItems]);

  // Get saved discount
  useEffect(() => {
    // Get data from local storage
    const localDiscount = localStorage.getItem(`discount-${customer?._id}`);

    // Update state
    setAppliedDiscount(localDiscount ? JSON.parse(localDiscount) : null);
  }, [customer, router.isReady]);

  // console.log(payableAmount, upcomingOrdersTotal);

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
                      {formatCurrencyToUSD(
                        cartItem.price * cartItem.quantity + cartItem.addonPrice
                      )}
                    </p>
                    <p className={styles.date}>
                      Delivery date:{' '}
                      <span>{convertDateToText(cartItem.deliveryDate)}</span> -{' '}
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
            onClick={() => checkoutCart(appliedDiscount?._id)}
          >
            {isLoading ? (
              <ButtonLoader />
            ) : payableAmount > 0 ? (
              `Checkout • ${formatCurrencyToUSD(payableAmount)} USD`
            ) : (
              'Place order'
            )}
          </button>
        </>
      )}
    </section>
  );
}
