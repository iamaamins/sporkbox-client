import styles from "@styles/layout/Modal.module.css";
import { Dispatch, SetStateAction } from "react";

interface IModalProps {
  showModal: boolean;
  component: JSX.Element;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

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
