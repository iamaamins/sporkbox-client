import { CSSProperties, Dispatch, SetStateAction } from 'react';
import styles from './ModalContainer.module.css';

type Props = {
  width?: string;
  component: JSX.Element;
  showModalContainer: boolean;
  setShowModalContainer: Dispatch<SetStateAction<boolean>>;
};

export default function ModalContainer({
  width,
  component,
  showModalContainer,
  setShowModalContainer,
}: Props) {
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
