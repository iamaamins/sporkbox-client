import Link from 'next/link';
import Image from 'next/image';
import CartIcon from './CartIcon';
import { CustomAxiosError } from 'types';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import logo from '@public/layout/logo.png';
import { useEffect, useState } from 'react';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import styles from './DesktopNav.module.css';
import { useCart } from '@context/Cart';

export default function DesktopNav() {
  const { setAlerts } = useAlert();
  const { upcomingDates } = useData();
  const { totalCartQuantity } = useCart();
  const pathName = useRouter().pathname;
  const [date, setDate] = useState<number>();
  const { isAdmin, isVendor, isCustomer, setAdmin, setVendor, setCustomer } =
    useUser();

  useEffect(() => {
    if (upcomingDates.length) setDate(upcomingDates[0]);
  }, [upcomingDates]);

  async function handleSignOut() {
    try {
      await axiosInstance.post(`/users/logout`, {});
      if (isAdmin) setAdmin(null);
      if (isVendor) setVendor(null);
      if (isCustomer) setCustomer(null);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  return (
    <nav className={styles.desktop_nav}>
      <div className={styles.logo}>
        <Link
          href={`${
            isAdmin ? '/admin' : isVendor ? '/restaurant' : '/dashboard'
          }`}
        >
          <a>
            <Image src={logo} alt='Logo' priority />
          </a>
        </Link>
      </div>

      <ul className={styles.navigation}>
        {/* Customer nav items */}
        <li className={!isCustomer ? styles.hide : ''}>
          <Link href='/company'>
            <a className={pathName === '/company' ? styles.active : ''}>
              Company
            </a>
          </Link>
        </li>

        <li className={!isCustomer ? styles.hide : ''}>
          <Link href='/profile'>
            <a className={pathName === '/profile' ? styles.active : ''}>
              Profile
            </a>
          </Link>
        </li>

        <li className={!isCustomer ? styles.hide : ''}>
          <Link href='/dashboard'>
            <a className={pathName === '/dashboard' ? styles.active : ''}>
              Dashboard
            </a>
          </Link>
        </li>

        <li className={!date || !isCustomer ? styles.hide : ''}>
          <Link href={`/place-order/${date}`}>
            <a className={pathName === '/place-order' ? styles.active : ''}>
              Place order
            </a>
          </Link>
        </li>

        <li className={!isCustomer ? styles.hide : ''}>
          <Link href={`/favorite`}>
            <a className={pathName === '/favorite' ? styles.active : ''}>
              Favorite
            </a>
          </Link>
        </li>

        <li className={isAdmin ? styles.hide : ''}>
          <Link href='/contact-us'>
            <a className={pathName === '/contact-us' ? styles.active : ''}>
              Contact
            </a>
          </Link>
        </li>

        {/* Admin nav items */}
        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin'>
            <a className={pathName === '/admin' ? styles.active : ''}>Home</a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/dashboard'>
            <a className={pathName === '/admin/dashboard' ? styles.active : ''}>
              Dashboard
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/delivered-orders'>
            <a
              className={
                pathName === '/admin/delivered-orders' ? styles.active : ''
              }
            >
              Delivered
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/restaurants'>
            <a
              className={pathName === '/admin/restaurants' ? styles.active : ''}
            >
              Restaurants
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/companies'>
            <a className={pathName === '/admin/companies' ? styles.active : ''}>
              Companies
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/add-admin'>
            <a className={pathName === '/admin/add-admin' ? styles.active : ''}>
              Add admin
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/discount-codes'>
            <a
              className={
                pathName === '/admin/discount-codes' ? styles.active : ''
              }
            >
              Discount codes
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/stat'>
            <a className={pathName === '/admin/stat' ? styles.active : ''}>
              Stat
            </a>
          </Link>
        </li>
      </ul>

      {/* Call to actions */}
      <div className={styles.ctas}>
        {isCustomer && (
          <CartIcon href='/cart' totalCartQuantity={totalCartQuantity} />
        )}
        <button
          onClick={handleSignOut}
          className={`${styles.sign_out} ${
            !isAdmin && !isVendor && !isCustomer && styles.hide
          }`}
        >
          Sign out
        </button>

        <Link href='/login'>
          <a
            className={`${styles.sing_in} ${
              (isAdmin || isVendor || isCustomer) && styles.hide
            }`}
          >
            Sign in
          </a>
        </Link>
      </div>
    </nav>
  );
}
