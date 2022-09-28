import styles from "@styles/layout/ToggleSwitch.module.css";

export default function ToggleSwitch({ isChecked, setIsChecked }) {
  return (
    <label className={styles.toggle_switch}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <span className={styles.slider} />
    </label>
  );
}
