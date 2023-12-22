import {
  formatItemStatToCSV,
  formatOrderStatToCSV,
  itemStatCSVHeaders,
  orderStatCSVHeaders,
} from '@utils/csv';
import { axiosInstance } from '@utils/index';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FiDownload } from 'react-icons/fi';
import styles from '@styles/admin/Stat.module.css';

export default function Stat() {
  // Hook
  const [orderStat, setOrderStat] = useState([]);
  const [itemStat, setItemStat] = useState([]);

  // Download order stat
  async function downloadOrderStat() {
    try {
      const response = await axiosInstance.get('/stats/order');
      setOrderStat(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Download item stat
  async function downloadItemStat() {
    try {
      const response = await axiosInstance.get('/stats/item');
      setItemStat(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Download the stats
  useEffect(() => {
    downloadOrderStat();
    downloadItemStat();
  }, []);
  return (
    <section className={styles.section}>
      <div className={styles.item}>
        <CSVLink
          data={formatOrderStatToCSV(orderStat)}
          headers={orderStatCSVHeaders}
          filename='Order Stat'
        >
          Order stat <FiDownload />
        </CSVLink>
      </div>

      <div className={styles.item}>
        <CSVLink
          data={formatItemStatToCSV(itemStat)}
          headers={itemStatCSVHeaders}
          filename='Item Stat'
        >
          Item stat <FiDownload />
        </CSVLink>
      </div>
    </section>
  );
}
