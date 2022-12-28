import React, { Dispatch, FormEvent, SetStateAction } from "react";
import styles from "@styles/admin/Archive.module.css";

interface IArchiveProps {
  name: string;
  action: string;
  updateStatus: () => Promise<void>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function Archive({
  name,
  action,
  setShowModal,
  updateStatus,
}: IArchiveProps) {
  return (
    <div className={styles.archive}>
      <p>
        Are you sure you want to {action.toLowerCase()} {name}?
      </p>

      <div className={styles.buttons}>
        <button onClick={() => setShowModal(false)}>No</button>
        <button onClick={updateStatus}>Yes</button>
      </div>
    </div>
  );
}
