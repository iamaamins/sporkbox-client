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
import { useRouter } from 'next/router';

export default function Stat() {
  // Hook
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [orderStat, setOrderStat] = useState({ isLoading: true, data: [] });
  const [itemStat, setItemStat] = useState({ isLoading: true, data: [] });

  // Download order stat
  async function downloadOrderStat() {
    try {
      // Get order stat and update state
      const response = await axiosInstance.get('/stats/order');
      setOrderStat((prevState) => ({ ...prevState, data: response.data }));
    } catch (err) {
      // Log error
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove the loader
      setOrderStat((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  // Download item stat
  async function downloadItemStat() {
    try {
      // Get item stat and update state
      const response = await axiosInstance.get('/stats/item');
      setItemStat((prevState) => ({ ...prevState, data: response.data }));
    } catch (err) {
      // Log error
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove the loader
      setItemStat((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  // Download the stats
  useEffect(() => {
    downloadOrderStat();
    downloadItemStat();
  }, [router.isReady]);
  return (
    <section className={styles.section}>
      {orderStat.data.length > 0 ? (
        <CSVLink
          data={formatOrderStatToCSV(orderStat.data)}
          headers={orderStatCSVHeaders}
          filename='Order Stat'
        >
          Order stat <FiDownload />
        </CSVLink>
      ) : orderStat.isLoading ? (
        <p>Order stat loading...</p>
      ) : (
        <p>No order stat found</p>
      )}

      {itemStat.data.length > 0 ? (
        <CSVLink
          data={formatItemStatToCSV(itemStat.data)}
          headers={itemStatCSVHeaders}
          filename='Item Stat'
        >
          Item stat <FiDownload />
        </CSVLink>
      ) : itemStat.isLoading ? (
        <p>Item stat loading...</p>
      ) : (
        <p>No item stat found</p>
      )}
    </section>
  );
}
