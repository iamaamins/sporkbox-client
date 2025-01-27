import Link from 'next/link';
import { useAlert } from '@context/Alert';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  MdGroups,
  MdLogout,
  MdDiscount,
  MdSpaceDashboard,
  MdAdminPanelSettings,
  MdOutlineRestaurantMenu,
} from 'react-icons/md';
import { useData } from '@context/Data';
import { useUser } from '@context/User';
import { IoLogIn } from 'react-icons/io5';
import { IoIosStats } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { CustomAxiosError } from 'types';
import { BsFillCalendar2DateFill } from 'react-icons/bs';
import styles from './MobileMenu.module.css';
import { AiTwotonePhone, AiTwotoneStar } from 'react-icons/ai';
import { TbBuildingStore, TbBuildingSkyscraper } from 'react-icons/tb';
import { currentYear, axiosInstance, showErrorAlert } from '@lib/utils';
import { MdHome } from 'react-icons/md';
import { RiBuildingLine } from 'react-icons/ri';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MobileMenu({ isOpen, setIsOpen }: Props) {
  const { setAlerts } = useAlert();
  const { upcomingDates } = useData();
  const [date, setDate] = useState<number>();
  const {
    isAdmin,
    isVendor,
    isCustomer,
    setAdmin,
    setVendor,
    customer,
    setCustomer,
  } = useUser();

  async function handleSignOut() {
    try {
      await axiosInstance.post(`/users/logout`, {});
      if (isAdmin) setAdmin(null);
      if (isVendor) setVendor(null);
      if (isCustomer) setCustomer(null);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  useEffect(() => {
    if (upcomingDates.length > 0) {
      setDate(upcomingDates[0]);
    }
  }, [upcomingDates]);

  // Disable body scroll if MobileMenu is open
  useEffect(() => {
    const body = document.querySelector('body');
    isOpen
      ? (body!.style.overflow = 'hidden')
      : (body!.style.overflow = 'auto');
  });

  return (
    <div className={`${styles.mobile_menu} ${isOpen && styles.open}`}>
      <ul className={styles.nav_items}>
        {/* Customer nav items */}
        <li
          className={
            !isCustomer || !customer?.isCompanyAdmin ? styles.hide : ''
          }
          onClick={() => setIsOpen(false)}
        >
          <Link href={`/company`}>
            <a>
              <RiBuildingLine />
              Company
            </a>
          </Link>
        </li>

        <li
          className={!isCustomer ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href={`/profile`}>
            <a>
              <CgProfile /> Profile
            </a>
          </Link>
        </li>

        <li
          className={!date || !isCustomer ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href={`/place-order/${date}`}>
            <a>
              <BsFillCalendar2DateFill /> Place order
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || !isCustomer ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/dashboard'>
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || !isCustomer ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/favorite'>
            <a>
              <AiTwotoneStar /> Favorite
            </a>
          </Link>
        </li>

        {/* Admin nav items */}
        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin'>
            <a>
              <MdHome /> Home
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/dashboard'>
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/delivered-orders'>
            <a>
              <MdOutlineRestaurantMenu /> Delivered
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/restaurants'>
            <a>
              <TbBuildingStore /> Restaurants
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/companies'>
            <a>
              <TbBuildingSkyscraper /> Companies
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/add-admin'>
            <a>
              <MdAdminPanelSettings /> Add admin
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/discount-codes'>
            <a>
              <MdDiscount /> Discount codes
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/admin/stat'>
            <a>
              <IoIosStats /> Stat
            </a>
          </Link>
        </li>

        {/* Generic nav items */}
        <li
          className={isAdmin || isVendor || isCustomer ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/register'>
            <a>
              <FaUserAlt /> Create account
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || isVendor || isCustomer ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/login'>
            <a>
              <IoLogIn /> Sign in
            </a>
          </Link>
        </li>

        <li
          className={isAdmin ? styles.hide : ''}
          onClick={() => setIsOpen(false)}
        >
          <Link href='/contact-us'>
            <a>
              <AiTwotonePhone /> Contact
            </a>
          </Link>
        </li>

        <li className={styles.hide} onClick={() => setIsOpen(false)}>
          <Link href='/about-us'>
            <a>
              <MdGroups /> About us
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin && !isVendor && !isCustomer ? styles.hide : ''}
          onClick={handleSignOut}
        >
          <span>
            <MdLogout /> Sign out
          </span>
        </li>
      </ul>

      <p className={styles.copyright}>
        Copyright &copy; {currentYear} Spork Bytes. <br /> All rights reserved
      </p>
    </div>
  );
}
