import styles from "@styles/admin/Company.module.css";

export default function Company() {
  return (
    <section className={styles.company}>
      <div className={styles.details}>
        <h2>Company 1</h2>
        <p>
          <span>Code:</span> company1
        </p>
        <p>
          <span>Weekly budget:</span> $140
        </p>
        <p>
          <span>Address:</span> address
        </p>
      </div>

      <div className={styles.buttons}>
        <button className={styles.edit}>Edit</button>
        <button className={styles.block}>Block</button>
      </div>
    </section>
  );
}
