import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdSpaceDashboard,
  MdGroups,
  MdLogout,
  MdOutlineSchedule,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import { useData } from "@context/Data";
import { useUser } from "@context/User";
import { IoLogIn } from "react-icons/io5";
import { IMobileMenuProps } from "types";
import { FaUserAlt } from "react-icons/fa";
import { AiTwotonePhone } from "react-icons/ai";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import styles from "@styles/layout/MobileMenu.module.css";
import { convertDateToMilliseconds, currentYear } from "@utils/index";
import { TbBuildingStore, TbBuildingSkyscraper } from "react-icons/tb";

export default function MobileMenu({ isOpen, setIsOpen }: IMobileMenuProps) {
  // Hooks
  const [date, setDate] = useState<number>();
  const { upcomingWeekRestaurants } = useData();
  const { isAdmin, isVendor, isCustomer, setUser } = useUser();

  useEffect(() => {
    if (upcomingWeekRestaurants.length > 0) {
      // Convert the first group's scheduled date to slug
      const date = convertDateToMilliseconds(
        upcomingWeekRestaurants[0].scheduledOn
      );

      // Update state
      setDate(date);
    }
  }, [upcomingWeekRestaurants]);

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
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      // Update user
      setUser(null);

      // Close the menu
      setIsOpen(false);
    } catch (err) {
      console.log(err);
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
          <Link href="/dashboard">
            <a>
              <MdSpaceDashboard /> Dashboard
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
          <Link href="/admin/orders">
            <a>
              <MdOutlineRestaurantMenu /> Orders
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
          <Link href="/admin/restaurants/scheduled">
            <a>
              <MdOutlineSchedule /> Scheduled
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

        {/* Generic nav items */}

        <li onClick={() => setIsOpen(false)}>
          <Link href={`/calendar/${date}`}>
            <a>
              <BsFillCalendar2DateFill /> Calendar
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || isVendor || isCustomer ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/register">
            <a>
              <FaUserAlt /> Create account
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || isVendor || isCustomer ? styles.hide : ""}
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

        <li
          className={isAdmin ? styles.hide : ""}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/about-us">
            <a>
              <MdGroups /> About us
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin && !isVendor && !isCustomer ? styles.hide : ""}
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
