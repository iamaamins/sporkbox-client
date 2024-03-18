import Image from 'next/image';
import Link from 'next/link';
import CartIcon from './CartIcon';
import { IMobileNavProps } from 'types';
import { useUser } from '@context/User';
import logo from '@public/layout/logo.png';
import styles from './MobileNav.module.css';

export default function MobileNav({ isOpen, setIsOpen }: IMobileNavProps) {
  const { isAdmin, isVendor, isCustomer } = useUser();

  return (
    <nav className={styles.mobile_nav}>
      <div
        className={`${styles.hamburger} ${isOpen && styles.open}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.line}></div>
      </div>

      <div className={styles.logo} onClick={() => setIsOpen(false)}>
        <Link
          href={`${
            isAdmin ? '/admin' : isVendor ? '/restaurant' : '/dashboard'
          }`}
        >
          <a>
            <Image src={logo} alt='logo' priority />
          </a>
        </Link>
      </div>

      {isCustomer && <CartIcon />}
    </nav>
  );
}
