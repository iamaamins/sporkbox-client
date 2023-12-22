import {
  formatItemStatToCSV,
  formatOrderStatToCSV,
  itemStatCSVHeaders,
  orderStatCSVHeaders,
} from '@utils/csv';
import { axiosInstance, showErrorAlert } from '@utils/index';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FiDownload } from 'react-icons/fi';
import styles from '@styles/admin/Stat.module.css';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';

export default function Stat() {
  // Hook
  const { setAlerts } = useAlert();
  const [orderStat, setOrderStat] = useState([]);
  const [itemStat, setItemStat] = useState([]);

  // Download order stat
  async function downloadOrderStat() {
    try {
      // Get order stat and update state
      const response = await axiosInstance.get('/stats/order');
      setOrderStat(response.data);
    } catch (err) {
      // Log error
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  // Download item stat
  async function downloadItemStat() {
    try {
      // Get item stat and update state
      const response = await axiosInstance.get('/stats/item');
      setItemStat(response.data);
    } catch (err) {
      // Log error
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  // Download the stats
  useEffect(() => {
    downloadOrderStat();
    downloadItemStat();
  }, []);
  return (
    <section className={styles.section}>
      {orderStat.length > 0 ? (
        <div className={styles.item}>
          <CSVLink
            data={formatOrderStatToCSV(orderStat)}
            headers={orderStatCSVHeaders}
            filename='Order Stat'
          >
            Order stat <FiDownload />
          </CSVLink>
        </div>
      ) : (
        <p>No order stat found</p>
      )}

      {itemStat.length > 0 ? (
        <div className={styles.item}>
          <CSVLink
            data={formatItemStatToCSV(itemStat)}
            headers={itemStatCSVHeaders}
            filename='Item Stat'
          >
            Item stat <FiDownload />
          </CSVLink>
        </div>
      ) : (
        <p>No item stat found</p>
      )}
    </section>
  );
}
