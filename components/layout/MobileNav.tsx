import Image from 'next/image';
import Link from 'next/link';
import CartIcon from './CartIcon';
import { IMobileNavProps } from 'types';
import { useUser } from '@context/User';
import logo from '@public/layout/logo.png';
import styles from './MobileNav.module.css';

export default function MobileNav({ isOpen, setIsOpen }: IMobileNavProps) {
  // Hooks
  const { isCustomer } = useUser();

  return (
    <nav className={styles.mobile_nav}>
      {/* Hamburger */}
      <div
        className={`${styles.hamburger} ${isOpen && styles.open}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.line}></div>
      </div>

      {/* Logo */}
      <div className={styles.logo} onClick={() => setIsOpen(false)}>
        <Link href={`${isCustomer ? '/dashboard' : '/admin'}`}>
          <a>
            <Image src={logo} alt='logo' priority />
          </a>
        </Link>
      </div>

      {/* Only show cart icon if the user is a customer */}
      {isCustomer && <CartIcon />}
    </nav>
  );
}
