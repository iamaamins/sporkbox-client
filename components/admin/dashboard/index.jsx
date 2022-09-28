import ToggleSwitch from "@components/layout/ToggleSwitch";
import styles from "@styles/admin/dashboard/Dashboard.module.css";
import { useState } from "react";

export default function Dashboard() {
  const [isChecked, setIsChecked] = useState(false);

  console.log(isChecked);
  return (
    <>
      <section className={styles.section}>
        <h2>Current orders</h2>
      </section>

      <section className={styles.section}>
        <h2>Restaurants</h2>
        <div>
          <div className={styles.title}>
            <p>Name</p>
            <p>Email</p>
            <p>Registered</p>
            <p>Status</p>
          </div>

          <div className={styles.restaurants}>
            <div className={styles.restaurant}>
              <p>Restaurant name</p>
              <ToggleSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
            </div>
            <div className={styles.restaurant}>
              <p>Restaurant name</p>
              <ToggleSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
            </div>
          </div>
        </div>
        <button>Add restaurant</button>
      </section>

      <section className={styles.section}>
        <h2>Companies</h2>
        <button>Add company</button>
      </section>
    </>
  );
}
