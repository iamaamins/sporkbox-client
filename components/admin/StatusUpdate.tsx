import styles from "@styles/admin/StatusUpdate.module.css";
import { IStatusUpdateProps } from "types";
import ButtonLoader from "@components/layout/ButtonLoader";

export default function StatusUpdate({
  name,
  action,
  isLoading,
  updateStatus,
  setShowStatusUpdateModal,
}: IStatusUpdateProps) {
  return (
    <div className={styles.status_update}>
      <p>
        Are you sure you want to {action.toLowerCase()} {name}?
      </p>

      <div className={styles.buttons}>
        <button onClick={() => setShowStatusUpdateModal(false)}>No</button>
        <button onClick={updateStatus}>
          {isLoading ? <ButtonLoader size={8} margin={2} /> : "Yes"}
        </button>
      </div>
    </div>
  );
}
