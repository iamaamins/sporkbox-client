import { FormEvent, useEffect, useState } from 'react';
import styles from './Pricing.module.css';
import { useUser } from '@context/User';
import { axiosInstance, numberToUSD, showErrorAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';

export default function Pricing() {
  return (
    <section className={styles.container}>
      <h2>Pricing</h2>
      <PaymentStat />
      <ItemStat />
    </section>
  );
}

type PaymentStat = {
  isLoading: boolean;
  data: {
    averageSpent: number;
    averagePaid: number;
    payingEmployeeCount: number;
  } | null;
};
function PaymentStat() {
  const { isAdmin } = useUser();
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
    async function getPaymentData(start: string, end: string) {
      try {
        const response = await axiosInstance.get(
          `/orders/payment-stat/${start}/${end}`
        );
        setPaymentStat((prevState) => ({ ...prevState, data: response.data }));
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setPaymentStat((prevState) => ({ ...prevState, isLoading: false }));
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
    if (isAdmin && start && end) getPaymentData(start, end);
  }, [isAdmin, period, range]);

  return (
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
  );
}

type ItemStat = {
  items: {
    count: string;
    isLoading: boolean;
  };
  average: {
    price: string;
    isLoading: boolean;
  };
};
function ItemStat() {
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const [price, setPrice] = useState('');
  const [itemStat, setItemStat] = useState<ItemStat>({
    items: { count: '', isLoading: false },
    average: {
      price: '',
      isLoading: true,
    },
  });

  async function getFilteredItemsCount(e: FormEvent) {
    e.preventDefault();
    if (!price) return;

    try {
      setItemStat((prevState) => ({
        ...prevState,
        items: { ...prevState.items, isLoading: true },
      }));
      const response = await axiosInstance.get(
        `/restaurants/items/count-and-average/${price}`
      );
      setItemStat((prevState) => ({
        ...prevState,
        items: {
          ...prevState.items,
          count: response.data.itemsCount,
        },
      }));
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setItemStat((prevState) => ({
        ...prevState,
        items: { ...prevState.items, isLoading: false },
      }));
    }
  }

  // Get average item price
  useEffect(() => {
    async function getAverageItemPrice() {
      try {
        const response = await axiosInstance.get(
          `/restaurants/items/count-and-average`
        );
        setItemStat((prevState) => ({
          ...prevState,
          average: {
            ...prevState.average,
            price: response.data.averagePrice,
          },
        }));
      } catch (err) {
        showErrorAlert(err as CustomAxiosError, setAlerts);
      } finally {
        setItemStat((prevState) => ({
          ...prevState,
          average: { ...prevState.average, isLoading: false },
        }));
      }
    }
    if (isAdmin) getAverageItemPrice();
  }, [isAdmin]);

  return (
    <div className={styles.item_stat}>
      <h3>Item stat</h3>
      <form onSubmit={getFilteredItemsCount}>
        <input
          type='text'
          id='price'
          value={price}
          placeholder='Enter a price to filter items...'
          onChange={(e) => {
            setPrice(e.target.value);
            if (!e.target.value)
              setItemStat((prevState) => ({
                ...prevState,
                items: {
                  ...prevState.items,
                  count: '',
                },
              }));
          }}
        />
      </form>
      {itemStat.items.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        itemStat.items.count && (
          <p className={styles.items_count}>
            <span>Number of active items</span>
            <span>{itemStat.items.count}</span>
          </p>
        )
      )}
      {itemStat.average.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        itemStat.average.price && (
          <p className={styles.average_price}>
            <span>Average active item price</span>
            <span>{numberToUSD(+itemStat.average.price)}</span>
          </p>
        )
      )}
    </div>
  );
}
