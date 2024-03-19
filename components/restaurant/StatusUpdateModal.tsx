import ButtonLoader from '@components/layout/ButtonLoader';
import { Dispatch, SetStateAction } from 'react';
import styles from './StatusUpdateModal.module.css';

type Props = {
  date: string;
  action: string;
  updateStatus: () => Promise<void>;
  isUpdating: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export default function StatusUpdateModal({
  date,
  action,
  updateStatus,
  isUpdating,
  setShowModal,
}: Props) {
  return (
    <div className={styles.container}>
      <p>
        Are you sure you want to {action} {date}?
      </p>

      <div className={styles.buttons}>
        <button
          onClick={() => setShowModal(false)}
          className={isUpdating ? styles.disabled : ''}
        >
          No
        </button>
        <button
          onClick={updateStatus}
          className={isUpdating ? styles.disabled : ''}
        >
          {isUpdating ? <ButtonLoader size={8} margin={2} /> : 'Yes'}
        </button>
      </div>
    </div>
  );
}
