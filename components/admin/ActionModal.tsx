import styles from './ActionModal.module.css';
import ButtonLoader from '@components/layout/ButtonLoader';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  name: string;
  action: string;
  isPerformingAction: boolean;
  performAction: () => Promise<void>;
  setShowActionModal: Dispatch<SetStateAction<boolean>>;
};

export default function ActionModal({
  name,
  action,
  performAction,
  isPerformingAction,
  setShowActionModal,
}: Props) {
  return (
    <div className={styles.action_modal}>
      <p>
        Are you sure you want to {action.toLowerCase()} {name}?
      </p>

      <div className={styles.buttons}>
        <button
          onClick={() => setShowActionModal(false)}
          className={isPerformingAction ? styles.disabled : ''}
        >
          No
        </button>
        <button
          onClick={performAction}
          className={isPerformingAction ? styles.disabled : ''}
        >
          {isPerformingAction ? <ButtonLoader size={8} margin={2} /> : 'Yes'}
        </button>
      </div>
    </div>
  );
}
