import { useEffect, useState } from 'react';
import styles from './PromoBanner.module.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  const key = 'banner:profile-&-support-page-redesign';
  const timeToLiveMS = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + timeToLiveMS).toISOString();

  function hideBanner() {
    localStorage.setItem(key, JSON.stringify({ isHidden: true, expiresAt }));
    setIsVisible(false);
  }

  function checkBannerStatus() {
    const result = localStorage.getItem(key);

    if (!result) {
      localStorage.setItem(key, JSON.stringify({ isHidden: false, expiresAt }));
      return setIsVisible(true);
    }

    const data = JSON.parse(result);
    if (data.isHidden) return setIsVisible(false);

    const hasExpired = new Date(data.expiresAt).getTime() <= Date.now();
    if (hasExpired) {
      localStorage.setItem(
        key,
        JSON.stringify({ isHidden: true, expiresAt: data.expiresAt })
      );
      return setIsVisible(false);
    }

    setIsVisible(true);
  }

  useEffect(() => {
    checkBannerStatus();
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <p>
        ✨ We've made some updates to Spork Box!{' '}
        <a
          onClick={hideBanner}
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.loom.com/share/31c1c0b1bb3e4ab5b14d03a125f6e7f9'
        >
          See what's new →
        </a>
      </p>

      <IoIosCloseCircleOutline size={20} onClick={hideBanner} />
    </div>
  );
}
