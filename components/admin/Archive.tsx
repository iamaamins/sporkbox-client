import React, { Dispatch, FormEvent, SetStateAction } from "react";
import styles from "@styles/admin/Archive.module.css";
import { IArchiveProps } from "types";

export default function Archive({
  name,
  action,
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
        <button onClick={updateStatus}>Yes</button>
      </div>
    </div>
  );
}
