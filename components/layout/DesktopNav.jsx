import Link from "next/link";
import Image from "next/image";
import logo from "@public/layout/logo.png";
import styles from "@styles/layout/DesktopNav.module.css";

export default function DesktopNav() {
  return (
    <nav className={styles.desktop_nav}>
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image src={logo} alt="Octib logo" priority />
          </a>
        </Link>
      </div>

      <ul className={styles.navigation}>
        <li>
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        </li>

        <li>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </li>

        <li>
          <Link href="/about-us">
            <a>About us</a>
          </Link>
        </li>
      </ul>

      <div className={styles.register}>
        <Link href="/register">
          <a>Sign up</a>
        </Link>
      </div>
    </nav>
  );
}
