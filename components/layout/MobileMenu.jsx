import Link from "next/link";
import { useEffect } from "react";
import {
  MdSpaceDashboard,
  MdGroups,
  MdLogout,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import { IoLogIn } from "react-icons/io5";
import { TbBuildingStore, TbBuildingSkyscraper } from "react-icons/tb";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { AiTwotonePhone } from "react-icons/ai";
import { useUser } from "@context/user";
import { currentYear } from "@utils/index";
import styles from "@styles/layout/MobileMenu.module.css";

export default function MobileMenu({ isOpen, setIsOpen }) {
  // Hooks
  const { isAdmin } = useUser();
  // const admin = null;

  // Disable body scroll if MobileMenu is open
  useEffect(() => {
    const body = document.querySelector("body");

    isOpen ? (body.style.overflow = "hidden") : (body.style.overflow = "auto");
  });

  return (
    <div className={`${styles.mobile_menu} ${isOpen && styles.open}`}>
      <ul className={styles.nav_items}>
        {/* Generic nav items */}
        <li
          className={isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/dashboard">
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        <li
          className={isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/register">
            <a>
              <IoLogIn /> Sign up
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

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/add-restaurant">
            <a>
              <TbBuildingStore /> Add Restaurant
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/add-company">
            <a>
              <TbBuildingSkyscraper /> Add Company
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/select-restaurants">
            <a>
              <BsFillCalendar2DateFill /> Select Restaurants
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/orders">
            <a>
              <MdOutlineRestaurantMenu /> All orders
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/restaurants">
            <a>
              <TbBuildingStore /> All restaurants
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/admin/companies">
            <a>
              <TbBuildingSkyscraper /> All companies
            </a>
          </Link>
        </li>

        <li
          className={!isAdmin ? styles.hide : null}
          onClick={() => setIsOpen(false)}
        >
          <span>
            <MdLogout /> Sign out
          </span>
        </li>

        {/* Customer nav items */}
      </ul>

      <p className={styles.copyright}>
        Copyright &copy; {currentYear} Spork Bytes. <br /> All rights reserved
      </p>
    </div>
  );
}
