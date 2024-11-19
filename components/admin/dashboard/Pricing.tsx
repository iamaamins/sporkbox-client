import { useEffect, useState } from 'react';
import styles from './Pricing.module.css';
import { useUser } from '@context/User';
import { axiosInstance, numberToUSD, showErrorAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';

export default function Pricing() {
  return (
    <section className={styles.container}>
      <h2>Pricing</h2>
      <PriceStat />
    </section>
  );
}

type PriceStat = {
  isLoading: boolean;
  data: {
    averageSpent: number;
    averagePaid: number;
    payingEmployeeCount: number;
  } | null;
};
function PriceStat() {
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const [period, setPeriod] = useState('7d');
  const [range, setRange] = useState({
    start: '',
    end: '',
  });
  const [priceStat, setPriceStat] = useState<PriceStat>({
    isLoading: true,
    data: null,
  });

  function getPastDate(days: number) {
    return new Date(new Date().setDate(new Date().getDate() - days))
      .toISOString()
      .split('T')[0];
  }

  // Get order data
  useEffect(() => {
    async function getPriceData(start: string, end: string) {
      try {
        const response = await axiosInstance.get(
          `/orders/price-stat/${start}/${end}`
        );
        setPriceStat((prevState) => ({ ...prevState, data: response.data }));
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setPriceStat((prevState) => ({ ...prevState, isLoading: false }));
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
    if (isAdmin && start && end) getPriceData(start, end);
  }, [isAdmin, period, range]);

  return (
    <div className={styles.average_spend}>
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
      {priceStat.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : priceStat.data ? (
        <table>
          <thead>
            <tr>
              <th>Average price/order</th>
              <th>Average payment</th>
              <th>Paying employee count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{numberToUSD(priceStat.data.averageSpent)}</td>
              <td>{numberToUSD(priceStat.data.averagePaid)}</td>
              <td>{priceStat.data.payingEmployeeCount}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className={styles.message}>No data found</p>
      )}
    </div>
  );
}
