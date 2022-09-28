import logo from "@public/layout/logo.png";
import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import styles from "@styles/layout/Footer.module.css";
import { currentYear } from "@utils/index";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.section}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <Image src={logo} alt="logo" priority />
            </a>
          </Link>
        </div>

        <p className={styles.about}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          explicabo minima atque similique! Voluptatum, id?
        </p>
      </div>

      <div className={styles.section}>
        <p className={styles.title}>Legal</p>

        <div className={styles.items}>
          <Link href="/privacy-policy">
            <a>Privacy policy</a>
          </Link>

          <Link href="/cookie-policy">
            <a>Cookie policy</a>
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.title}>Contact</p>

        <address className={styles.items}>
          <a href="tel:503-821-7709">Call us</a>
          <a href="mailto:hellopdx@sporkbytes.com">Email us</a>
          <p>901 SE Oak St Portland, OR 97214</p>

          <div className={styles.social}>
            <a href="https://instagram.com/sporkbytes" target="_blank">
              <AiFillInstagram />
            </a>
            <a href="https://twitter.com/sporkbytes" target="_blank">
              <AiOutlineTwitter />
            </a>
            <a href="https://facebook.com/sporkbytes" target="_blank">
              <FaFacebookSquare />
            </a>
          </div>
        </address>
      </div>

      <p className={styles.copyright}>
        Spork Bytes &copy; Copyright {currentYear} <br /> All rights reserved
      </p>
    </footer>
  );
}
