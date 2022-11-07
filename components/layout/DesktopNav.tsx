import Link from "next/link";
import Image from "next/image";
import CartIcon from "./CartIcon";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import logo from "@public/layout/logo.png";
import { useEffect, useState } from "react";
import styles from "@styles/layout/DesktopNav.module.css";
import { axiosInstance, convertDateToMS } from "@utils/index";

export default function DesktopNav() {
  // Hooks
  const pathName = useRouter().pathname;
  const [date, setDate] = useState<number>();
  const { upcomingWeekRestaurants } = useData();
  const { isAdmin, isCustomer, isVendor, setUser } = useUser();

  useEffect(() => {
    if (upcomingWeekRestaurants.length > 0) {
      // Convert the first group's scheduled date to slug
      const date = convertDateToMS(upcomingWeekRestaurants[0].scheduledOn);

      // Update state
      setDate(date);
    }
  }, [upcomingWeekRestaurants]);

  // Handle sign out
  async function handleSignOut() {
    // Log a user out
    try {
      // Make request to backend
      await axiosInstance.post(`/users/logout`, {});

      // Update user
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className={styles.desktop_nav}>
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image src={logo} alt="Logo" priority />
          </a>
        </Link>
      </div>

      <ul className={styles.navigation}>
        <li className={isAdmin || !isCustomer ? styles.hide : ""}>
          <Link href="/dashboard">
            <a className={pathName === "/dashboard" ? styles.active : ""}>
              Dashboard
            </a>
          </Link>
        </li>

        <li className={!date ? styles.hide : ""}>
          <Link href={`/calendar/${date}`}>
            <a className={pathName === "/calendar" ? styles.active : ""}>
              Calendar
            </a>
          </Link>
        </li>

        <li className={!isCustomer ? styles.hide : ""}>
          <Link href={`/favorite`}>
            <a className={pathName === "/favorite" ? styles.active : ""}>
              Favorite
            </a>
          </Link>
        </li>

        <li className={isAdmin ? styles.hide : ""}>
          <Link href="/contact-us">
            <a className={pathName === "/contact-us" ? styles.active : ""}>
              Contact
            </a>
          </Link>
        </li>

        <li className={isAdmin ? styles.hide : ""}>
          <Link href="/about-us">
            <a className={pathName === "/about-us" ? styles.active : ""}>
              About us
            </a>
          </Link>
        </li>

        <li>
          <Link href="/project-scope">
            <a className={pathName === "/project-scope" ? styles.active : ""}>
              Project scope
            </a>
          </Link>
        </li>

        {/* Admin nav items */}
        <li className={!isAdmin ? styles.hide : ""}>
          <Link href="/admin">
            <a className={pathName === "/admin" ? styles.active : ""}>
              Dashboard
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ""}>
          <Link href="/admin/orders">
            <a className={pathName === "/admin/orders" ? styles.active : ""}>
              Orders
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ""}>
          <Link href="/admin/restaurants">
            <a
              className={pathName === "/admin/restaurants" ? styles.active : ""}
            >
              Restaurants
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ""}>
          <Link href="/admin/restaurants/scheduled">
            <a
              className={
                pathName === "/admin/restaurants/scheduled" ? styles.active : ""
              }
            >
              Scheduled
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ""}>
          <Link href="/admin/companies">
            <a className={pathName === "/admin/companies" ? styles.active : ""}>
              Companies
            </a>
          </Link>
        </li>
      </ul>

      {/* Call to actions */}
      <div className={styles.ctas}>
        <CartIcon />

        <button
          onClick={handleSignOut}
          className={`${styles.sign_out} ${
            !isAdmin && !isVendor && !isCustomer && styles.hide
          }`}
        >
          Sign out
        </button>

        <Link href="/login">
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
