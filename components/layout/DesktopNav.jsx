import Link from "next/link";
import Image from "next/image";
import styles from "@styles/layout/DesktopNav.module.css";

export default function DesktopNav() {
  return (
    <nav className={styles.desktop_nav}>
      <div className={styles.logo}>
        <Link href="/">
          <a>{/* <Image src={logo} alt="Octib logo" priority /> */}</a>
        </Link>
      </div>

      <ul className={styles.navigation}>
        <li>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </li>

        <li>
          <Link href="/login">
            <a>Log in</a>
          </Link>
        </li>

        <li>
          <Link href="/register">
            <a>Sign up</a>
          </Link>
        </li>
      </ul>

      <div className={styles.github}>Account</div>
    </nav>
  );
}
