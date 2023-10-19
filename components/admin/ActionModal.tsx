import { ActionModalProps } from 'types';
import styles from '@styles/admin/ActionModal.module.css';
import ButtonLoader from '@components/layout/ButtonLoader';

export default function ActionModal({
  name,
  action,
  performAction,
  isPerformingAction,
  setShowActionModal,
}: ActionModalProps) {
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
