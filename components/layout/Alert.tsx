import { Alert as AlertType } from 'types';
import { MdErrorOutline } from 'react-icons/md';
import styles from './Alert.module.css';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

type Props = { alerts: AlertType[] };

export default function Alert({ alerts }: Props) {
  return (
    <>
      {alerts.length > 0 && (
        <div className={styles.alerts}>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`${styles.alert} ${
                alert.type === 'success' && styles.success
              } ${alert.type === 'failed' && styles.failed}`}
            >
              <p>
                {alert.type === 'success' ? (
                  <IoMdCheckmarkCircleOutline className={styles.icon} />
                ) : (
                  <MdErrorOutline className={styles.icon} />
                )}
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
