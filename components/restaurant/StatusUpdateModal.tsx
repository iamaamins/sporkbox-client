import ButtonLoader from '@components/layout/ButtonLoader';
import { Dispatch, SetStateAction } from 'react';
import styles from './StatusUpdateModal.module.css';
import { dateToText } from '@lib/utils';

type Props = {
  date: string;
  action: string;
  isUpdating: boolean;
  updateStatus: () => Promise<void>;
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
        Are you sure you want to {action} {dateToText(+date)}?
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
