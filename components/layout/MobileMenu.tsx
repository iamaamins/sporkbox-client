import { IMobileMenu } from "types";
import Link from "next/link";
import { useEffect } from "react";
import { MdSpaceDashboard, MdAccountBox, MdGroups } from "react-icons/md";
import { IoLogIn } from "react-icons/io5";
import { AiTwotonePhone } from "react-icons/ai";
import styles from "@styles/layout/MobileMenu.module.css";

export default function MobileMenu({ isOpen }: IMobileMenu) {
  const currentYear = new Date().getFullYear();

  // Disable body scroll if MobileMenu is open
  useEffect(() => {
    const body = document.querySelector("body")!;

    isOpen ? (body.style.overflow = "hidden") : (body.style.overflow = "auto");
  });

  return (
    <div className={`${styles.mobile_menu} ${isOpen && styles.open}`}>
      <ul className={styles.nav_items}>
        <li>
          <Link href="/dashboard">
            <a>
              <MdSpaceDashboard /> Dashboard
            </a>
          </Link>
        </li>

        <li>
          <Link href="/login">
            <a>
              <MdAccountBox /> Log in
            </a>
          </Link>
        </li>

        <li>
          <Link href="/register">
            <a>
              <IoLogIn /> Sign up
            </a>
          </Link>
        </li>

        <li>
          <Link href="/contact">
            <a>
              <AiTwotonePhone /> Contact
            </a>
          </Link>
        </li>

        <li>
          <Link href="/about-us">
            <a>
              <MdGroups /> About us
            </a>
          </Link>
        </li>
      </ul>

      <p className={styles.copyright}>
        Copyright &copy; {currentYear} Spork Bytes. <br /> All rights reserved
      </p>
    </div>
  );
}
