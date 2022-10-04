import Link from "next/link";
import Image from "next/image";
import logo from "@public/layout/logo.png";
import { useUser } from "@context/user";
import styles from "@styles/layout/DesktopNav.module.css";

export default function DesktopNav() {
  const { isAdmin, isCustomer, isVendor } = useUser();

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
        <li className={isAdmin ? styles.hide : null}>
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        </li>

        <li className={isAdmin ? styles.hide : null}>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </li>

        <li className={isAdmin ? styles.hide : null}>
          <Link href="/about-us">
            <a>About us</a>
          </Link>
        </li>

        {/* Admin nav items */}
        <li className={!isAdmin ? styles.hide : null}>
          <Link href="/admin">
            <a>Dashboard</a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : null}>
          <Link href="/admin/orders">
            <a>Orders</a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : null}>
          <Link href="/admin/restaurants">
            <a>Restaurants</a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : null}>
          <Link href="/admin/companies">
            <a>Companies</a>
          </Link>
        </li>
      </ul>

      {/* Call to actions */}
      <div className={styles.ctas}>
        <button
          className={!isAdmin && !isVendor && !isCustomer ? styles.hide : null}
        >
          Sign out
        </button>

        <Link href="/login">
          <a className={isAdmin || isVendor || isCustomer ? styles.hide : null}>
            Sign in
          </a>
        </Link>
      </div>
    </nav>
  );
}
