import styles from "@styles/admin/Archive.module.css";
import { IArchiveProps } from "types";
import ButtonLoader from "@components/layout/ButtonLoader";

export default function Archive({
  name,
  action,
  isLoading,
  updateStatus,
  setShowArchiveModal,
}: IArchiveProps) {
  return (
    <div className={styles.archive}>
      <p>
        Are you sure you want to {action.toLowerCase()} {name}?
      </p>

      <div className={styles.buttons}>
        <button onClick={() => setShowArchiveModal(false)}>No</button>
        <button onClick={updateStatus}>
          {isLoading ? <ButtonLoader size={8} margin={2} /> : "Yes"}
        </button>
      </div>
    </div>
  );
}
