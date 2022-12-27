import { IModalProps } from "types";
import styles from "@styles/layout/Modal.module.css";

export default function Modal({
  showModal,
  setShowModal,
  component,
}: IModalProps) {
  return (
    <>
      <div className={`${styles.modal} ${showModal && styles.show}`}>
        {component}
      </div>

      <div
        onClick={() => setShowModal(false)}
        className={`${styles.overlay} ${showModal && styles.show}`}
      ></div>
    </>
  );
}
