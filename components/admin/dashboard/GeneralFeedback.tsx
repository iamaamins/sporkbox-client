import { axiosInstance, getPastDate, showErrorAlert } from '@lib/utils';
import styles from './GeneralFeedback.module.css';
import { useEffect, useState } from 'react';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { useUser } from '@context/User';

export default function GeneralFeedback() {
  const { setAlerts } = useAlert();
  const { isAdmin } = useUser();
  const [period, setPeriod] = useState('7d');
  const [range, setRange] = useState({ start: '', end: '' });
  const [generalFeedbackData, setGeneralFeedbackData] = useState({
    isLoading: true,
    satisfactionRate: 0,
    submissionCount: 0,
  });

  // Get general feedback data
  useEffect(() => {
    async function getGeneralFeedbackData(start: string, end: string) {
      try {
        const response = await axiosInstance.get(
          `/feedback/general/${start}/${end}`
        );

        setGeneralFeedbackData({
          isLoading: false,
          satisfactionRate: response.data.satisfactionRate,
          submissionCount: response.data.submissionCount,
        });
      } catch (err) {
        setGeneralFeedbackData((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    let start = '';
    let end = getPastDate(0);
    if (period === '7d') start = getPastDate(7);
    if (period === '30d') start = getPastDate(30);
    if (period === '3m') start = getPastDate(90);
    if (period === 'custom' && range.start && range.end) {
      start = range.start;
      end = range.end;
    }

    if (isAdmin && start && end) getGeneralFeedbackData(start, end);
  }, [isAdmin, period, range]);

  return (
    <section className={styles.container}>
      <h2>Satisfaction</h2>
      <form className={styles.period_and_range_selector}>
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setRange({ start: '', end: '' });
          }}
          className={styles.period_selector}
        >
          <option value='7d'>Last 7 days</option>
          <option value='30d'>Last 30 days</option>
          <option value='3m'>Last 3 months</option>
          <option value='custom'>Custom range</option>
        </select>
        {period === 'custom' && (
          <div className={styles.range_selector}>
            <div>
              <label htmlFor='start'>From</label>
              <input
                type='date'
                id='start'
                value={range.start}
                onChange={(e) =>
                  setRange((prevState) => ({
                    ...prevState,
                    start: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor='end'>To</label>
              <input
                type='date'
                id='end'
                value={range.end}
                max={getPastDate(0)}
                onChange={(e) =>
                  setRange((prevState) => ({
                    ...prevState,
                    end: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </form>
      {generalFeedbackData.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Satisfaction rate</th>
              <th># of submissions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{generalFeedbackData.satisfactionRate}%</td>
              <td>{generalFeedbackData.submissionCount}</td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
}
