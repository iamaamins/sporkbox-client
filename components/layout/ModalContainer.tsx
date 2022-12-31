import { IModalContainerProps } from "types";
import styles from "@styles/layout/ModalContainer.module.css";

export default function ModalContainer({
  component,
  showModalContainer,
  setShowModalContainer,
}: IModalContainerProps) {
  return (
    <>
      <div
        className={`${styles.modal_container} ${
          showModalContainer && styles.show
        }`}
      >
        {component}
      </div>

      <div
        onClick={() => setShowModalContainer(false)}
        className={`${styles.overlay} ${showModalContainer && styles.show}`}
      ></div>
    </>
  );
}
