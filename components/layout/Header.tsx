import { useState } from 'react';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <DesktopNav />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
