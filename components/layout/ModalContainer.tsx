import { CSSProperties } from 'react';
import { ModalContainerProps } from 'types';
import styles from '@styles/layout/ModalContainer.module.css';

export default function ModalContainer({
  width,
  component,
  showModalContainer,
  setShowModalContainer,
}: ModalContainerProps) {
  return (
    <>
      <div
        className={`${styles.modal_container} ${
          showModalContainer && styles.show
        }`}
        style={{ '--width': width || 'fit-content' } as CSSProperties}
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
