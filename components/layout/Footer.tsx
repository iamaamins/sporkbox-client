import Link from 'next/link';
import Image from 'next/image';
import logo from '@public/layout/logo.png';
import { currentYear } from '@utils/index';
import { FaFacebookSquare } from 'react-icons/fa';
import styles from '@styles/layout/Footer.module.css';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.sections}>
        <div className={styles.section}>
          <div className={styles.logo}>
            <Link href='/'>
              <a>
                <Image src={logo} alt='logo' priority />
              </a>
            </Link>
          </div>

          <p className={styles.about}>
            Portland restaurants catered to your office.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.title}>Legal</p>

          <div className={styles.items}>
            <a
              href='https://sporkbyt.es/privacy-policy'
              target='_blank'
              rel='noreferrer'
            >
              Privacy policy
            </a>

            <a
              href='https://www.sporkbytes.com/cookie-policy/'
              target='_blank'
              rel='noreferrer'
            >
              Cookie policy
            </a>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.title}>Contact</p>

          <address className={styles.items}>
            <a href='tel:503-821-7709'>Call us</a>
            <a href='mailto:hellopdx@sporkbytes.com'>Email us</a>
            <p>777 NE 7th Ave Portland, OR 97232</p>

            <div className={styles.social}>
              <a
                href='https://instagram.com/sporkbytes'
                target='_blank'
                rel='noreferrer'
              >
                <AiFillInstagram />
              </a>
              <a
                href='https://twitter.com/sporkbytes'
                target='_blank'
                rel='noreferrer'
              >
                <AiOutlineTwitter />
              </a>
              <a
                href='https://facebook.com/sporkbytes'
                target='_blank'
                rel='noreferrer'
              >
                <FaFacebookSquare />
              </a>
            </div>
          </address>
        </div>
      </div>

      <p className={styles.copyright}>
        Spork Bytes &copy; Copyright {currentYear} <br /> All rights reserved
      </p>
    </footer>
  );
}
