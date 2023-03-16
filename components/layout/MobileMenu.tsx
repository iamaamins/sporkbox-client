import Link from "next/link";
import { AxiosError } from "axios";
import { useAlert } from "@context/Alert";
import { useEffect, useState } from "react";
import {
  MdGroups,
  MdLogout,
  MdSpaceDashboard,
  MdAdminPanelSettings,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import { useData } from "@context/Data";
import { useUser } from "@context/User";
import { IoLogIn } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IAxiosError, IMobileMenuProps } from "types";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import styles from "@styles/layout/MobileMenu.module.css";
import { AiTwotonePhone, AiTwotoneStar } from "react-icons/ai";
import { TbBuildingStore, TbBuildingSkyscraper } from "react-icons/tb";
import { currentYear, axiosInstance, showErrorAlert } from "@utils/index";

export default function MobileMenu({ isOpen, setIsOpen }: IMobileMenuProps) {
  // Hooks
  const { setAlerts } = useAlert();
  const { upcomingDatesAndShifts } = useData();
  const [date, setDate] = useState<number>();
  const { isAdmin, isCustomer, setAdmin, setCustomer } = useUser();

  // Get first scheduled date of next week
  useEffect(() => {
    if (upcomingDatesAndShifts.length > 0) {
      setDate(upcomingDatesAndShifts[0].date);
    }
  }, [upcomingDatesAndShifts]);

  // Disable body scroll if MobileMenu is open
  useEffect(() => {
    const body = document.querySelector("body");

    isOpen
      ? (body!.style.overflow = "hidden")
      : (body!.style.overflow = "auto");
  });

  // Logout user
  async function handleSignOut() {
    // Sign a user out
    try {
      // Make request to backend
      await axiosInstance.post(`/users/logout`, {});

      // Update state
      if (isAdmin) {
        setAdmin(null);
      } else {
        setCustomer(null);
      }

      // Close the menu
      setIsOpen(false);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    }
  }

  return (
    <div className={`${styles.mobile_menu} ${isOpen && styles.open}`}>
      <ul className={styles.nav_items}>
        {/* Customer nav items */}
        <li
          className={!isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href={`/profile`}>
            <a>
              <CgProfile /> Profile
            </a>
          </Link>
        </li>

        <li
          className={!date || !isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href={`/place-order/${date}`}>
            <a>
              <BsFillCalendar2DateFill /> Place order
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || !isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/dashboard">
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || !isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/favorite">
            <a>
              <AiTwotoneStar /> Favorite
            </a>
          </Link>
        </li>

        {/* Admin nav items */}
        <li
          className={!isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin">
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/delivered-orders">
            <a>
              <MdOutlineRestaurantMenu /> Delivered
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/restaurants">
            <a>
              <TbBuildingStore /> Restaurants
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/companies">
            <a>
              <TbBuildingSkyscraper /> Companies
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/add-admin">
            <a>
              <MdAdminPanelSettings /> Add admin
            </a>
          </Link>
        </li>

        {/* Generic nav items */}
        <li
          className={isAdmin || isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/register">
            <a>
              <FaUserAlt /> Create account
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/login">
            <a>
              <IoLogIn /> Sign in
            </a>
          </Link>
        </li>

        <li
          className={isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/contact-us">
            <a>
              <AiTwotonePhone /> Contact
            </a>
          </Link>
        </li>

        <li className={styles.hide} onClick={() => setIsOpen(false)}>
          <Link href="/about-us">
            <a>
              <MdGroups /> About us
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin && !isCustomer ? styles.hide : ""}
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
