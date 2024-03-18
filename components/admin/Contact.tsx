import { MdEmail } from 'react-icons/md';
import { IoIosCall } from 'react-icons/io';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section className={styles.contact}>
      <div className={styles.top}>
        <h1>Get in touch!</h1>
        <p>Contact us for any help you need regarding Spork Box.</p>
      </div>

      <div className={styles.details}>
        <a href='mailto:portland@sporkbytes.com'>
          <MdEmail />
          <span>portland@sporkbytes.com</span>
        </a>
        <a href='tel:503-821-7709'>
          <IoIosCall /> <span>503-821-7709</span>{' '}
        </a>
      </div>
    </section>
  );
}
