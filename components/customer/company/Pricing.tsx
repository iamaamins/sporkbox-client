import { useEffect, useState } from 'react';
import styles from './Pricing.module.css';
import { useUser } from '@context/User';
import { axiosInstance, numberToUSD, showErrorAlert } from '@lib/utils';
import { CustomAxiosError, Customer } from 'types';
import { useAlert } from '@context/Alert';

type PaymentStat = {
  isLoading: boolean;
  data: {
    averageSpent: number;
    averagePaid: number;
    payingEmployeeCount: number;
  } | null;
};

export default function Pricing() {
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [period, setPeriod] = useState('7d');
  const [range, setRange] = useState({
    start: '',
    end: '',
  });
  const [paymentStat, setPaymentStat] = useState<PaymentStat>({
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
    async function getPaymentData(
      start: string,
      end: string,
      customer: Customer
    ) {
      try {
        const response = await axiosInstance.get(
          `/orders/${customer.companies[0].code}/payment-stat/${start}/${end}`
        );

        setPaymentStat({ isLoading: false, data: response.data });
      } catch (err) {
        setPaymentStat((prevState) => ({ ...prevState, isLoading: false }));
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
    if (customer && start && end) getPaymentData(start, end, customer);
  }, [customer, period, range]);

  return (
    <section className={styles.container}>
      <h2>Pricing</h2>
      <div className={styles.payment_stat}>
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
        {paymentStat.isLoading ? (
          <p className={styles.message}>Loading...</p>
        ) : paymentStat.data ? (
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
                <td>{numberToUSD(paymentStat.data.averageSpent)}</td>
                <td>{numberToUSD(paymentStat.data.averagePaid)}</td>
                <td>{paymentStat.data.payingEmployeeCount}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className={styles.message}>No data found</p>
        )}
      </div>
    </section>
  );
}
