import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@context/User';
import { IoMdRemove } from 'react-icons/io';
import styles from '@components/customer/Cart.module.css';
import ButtonLoader from '@components/layout/ButtonLoader';
import {
  axiosInstance,
  dateToText,
  numberToUSD,
  getAddonsTotal,
  showErrorAlert,
  getDateTotal,
  dateToMS,
  showSuccessAlert,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';
import { CartItem, CustomAxiosError, Customer, CustomerOrder } from 'types';
import { useData } from '@context/Data';

type AppliedDiscount = {
  _id: string;
  code: string;
  value: number;
};

export default function Cart() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const { allUpcomingOrders, setAllUpcomingOrders } = useData();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [employee, setEmployee] = useState<Customer>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allOrders, setAllOrders] = useState<CustomerOrder[]>([]);
  const [payableAmount, setPayableAmount] = useState(0);
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
        `admin-discount-${employee?._id}`,
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
    localStorage.removeItem(`admin-discount-${employee?._id}`);
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
      `admin-cart-${employee?._id}`,
      JSON.stringify(updatedCartItems)
    );
  }

  async function checkout(discountCodeId?: string) {
    if (!employee) return showErrorAlert('No employee found', setAlerts);
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
        employeeId: employee._id,
      });

      if (typeof response.data === 'string') {
        open(response.data);
      } else {
        localStorage.removeItem(`admin-cart-${employee._id}`);
        localStorage.removeItem(`admin-discount-${employee._id}`);
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
  }, [isAdmin, router]);

  // Get cart items
  useEffect(() => {
    if (router.isReady && isAdmin && employee)
      setCartItems(
        JSON.parse(localStorage.getItem(`admin-cart-${employee?._id}`) || '[]')
      );
  }, [isAdmin, employee, router]);

  // Get employee all orders
  useEffect(() => {
    async function getAllOrders() {
      try {
        const response = await axiosInstance.get(
          `/orders/${router.query.employee}/all-delivered-orders`
        );
        const deliveredOrders = response.data;
        const upcomingOrders = allUpcomingOrders.data.filter(
          (upcomingOrder) =>
            upcomingOrder.customer._id === router.query.employee
        );
        setAllOrders([...upcomingOrders, ...deliveredOrders]);
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady && isAdmin && employee) getAllOrders();
  }, [isAdmin, employee, router]);

  // Get payable amount
  useEffect(() => {
    if (router.isReady && cartItems.length && employee) {
      const upcomingDateTotalDetails = allOrders
        .filter((order) =>
          cartItems.some(
            (cartItem) =>
              cartItem.companyId === order.company._id &&
              cartItem.deliveryDate === dateToMS(order.delivery.date)
          )
        )
        .map((order) => ({
          date: dateToMS(order.delivery.date),
          total: order.item.total - (order.payment?.distributed || 0),
        }));
      const upcomingOrderDetails = getDateTotal(upcomingDateTotalDetails);

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
      const company = employee.companies.find(
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
        setPayableAmount(totalPayableAmount - discountAmount);
      }
    }
  }, [allOrders, cartItems, appliedDiscount, router]);

  // Get saved discount
  useEffect(() => {
    if (router.isReady && isAdmin && employee) {
      const localDiscount = localStorage.getItem(
        `admin-discount-${employee?._id}`
      );
      setAppliedDiscount(localDiscount ? JSON.parse(localDiscount) : null);
    }
  }, [isAdmin, employee, router]);

  // Remove discount
  useEffect(() => {
    if (appliedDiscount && payableAmount <= 0) removeDiscount();
  }, [cartItems]);

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
            disabled={isCheckingOut}
            className={styles.button}
            onClick={() => checkout(appliedDiscount?._id)}
          >
            {isCheckingOut ? (
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
