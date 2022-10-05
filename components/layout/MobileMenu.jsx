import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import {
  MdSpaceDashboard,
  MdGroups,
  MdLogout,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import { IoLogIn } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { TbBuildingStore, TbBuildingSkyscraper } from "react-icons/tb";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { AiTwotonePhone } from "react-icons/ai";
import { BiPlusCircle } from "react-icons/bi";
import { useUser } from "@context/user";
import { API_URL, currentYear } from "@utils/index";
import styles from "@styles/layout/MobileMenu.module.css";

export default function MobileMenu({ isOpen, setIsOpen }) {
  // Hooks
  const { isAdmin, isVendor, isCustomer, setUser } = useUser();

  // Disable body scroll if MobileMenu is open
  useEffect(() => {
    const body = document.querySelector("body");

    isOpen ? (body.style.overflow = "hidden") : (body.style.overflow = "auto");
  });

  // Logout user
  async function handleSignOut() {
    // Sign a user out
    try {
      // Make request to backend
      await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });

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
          className={!isCustomer ? styles.hide : null}
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
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin">
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        {/* <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/add-restaurant">
            <a>
              <BiPlusCircle /> Add Restaurant
            </a>
          </Link>
        </li> */}

        {/* <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/add-company">
            <a>
              <BiPlusCircle /> Add Company
            </a>
          </Link>
        </li> */}

        {/* <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/schedule-restaurants">
            <a>
              <BsFillCalendar2DateFill /> Schedule Restaurants
            </a>
          </Link>
        </li> */}

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/orders">
            <a>
              <MdOutlineRestaurantMenu /> Orders
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/restaurants">
            <a>
              <TbBuildingStore /> Restaurants
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/scheduled-restaurants">
            <a>
              <BsFillCalendar2DateFill /> Scheduled
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/companies">
            <a>
              <TbBuildingSkyscraper /> Companies
            </a>
          </Link>
        </li>

        {/* Generic nav items */}

        <li
          className={isAdmin || isVendor || isCustomer ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/register">
            <a>
              <FaUserAlt /> Create account
            </a>
          </Link>
        </li>

        <li
          className={isAdmin || isVendor || isCustomer ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/login">
            <a>
              <IoLogIn /> Sign in
            </a>
          </Link>
        </li>

        <li
          className={isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/contact">
            <a>
              <AiTwotonePhone /> Contact
            </a>
          </Link>
        </li>

        <li
          className={isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/about-us">
            <a>
              <MdGroups /> About us
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin && !isVendor && !isCustomer ? styles.hide : null}
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
