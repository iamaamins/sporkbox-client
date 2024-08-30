import {
  formatItemStatToCSV,
  formatOrderStatToCSV,
  formatPeopleStatToCSV,
  formatRestaurantItemsStat,
  itemStatCSVHeaders,
  orderStatCSVHeaders,
  peopleStatCSVHeaders,
  restaurantItemsCSVHeaders,
  reviewStatCSVHeaders,
} from '@lib/csv';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FiDownload } from 'react-icons/fi';
import styles from './Stat.module.css';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';

export default function Stat() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [orderStat, setOrderStat] = useState({ isLoading: true, data: [] });
  const [itemStat, setItemStat] = useState({ isLoading: true, data: [] });
  const [peopleStat, setPeopleStat] = useState({ isLoading: true, data: [] });
  const [restaurantItemsStat, setRestaurantItemsStat] = useState({
    isLoading: true,
    data: [],
  });
  const [reviewStat, setReviewStat] = useState({ isLoading: true, data: [] });

  async function getOrderStat() {
    try {
      const response = await axiosInstance.get('/stats/order');
      setOrderStat((prevState) => ({ ...prevState, data: response.data }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setOrderStat((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  async function getItemStat() {
    try {
      const response = await axiosInstance.get('/stats/item');
      setItemStat((prevState) => ({ ...prevState, data: response.data }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setItemStat((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  async function getPeopleStat() {
    try {
      const response = await axiosInstance.get('/stats/people');
      setPeopleStat((prevState) => ({ ...prevState, data: response.data }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setPeopleStat((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  async function getRestaurantItemsStat() {
    try {
      const response = await axiosInstance.get('/stats/restaurant-items');
      setRestaurantItemsStat((prevState) => ({
        ...prevState,
        data: response.data,
      }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setRestaurantItemsStat((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  }

  async function getReviewStat() {
    try {
      const response = await axiosInstance.get('/stats/review');
      setReviewStat((prevState) => ({ ...prevState, data: response.data }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setReviewStat((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  // Get the stats
  useEffect(() => {
    getOrderStat();
    getItemStat();
    getPeopleStat();
    getRestaurantItemsStat();
    getReviewStat();
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

      {peopleStat.data.length > 0 ? (
        <CSVLink
          data={formatPeopleStatToCSV(peopleStat.data)}
          headers={peopleStatCSVHeaders}
          filename='People Stat'
        >
          People stat <FiDownload />
        </CSVLink>
      ) : peopleStat.isLoading ? (
        <p>People stat loading...</p>
      ) : (
        <p>No people stat found</p>
      )}

      {restaurantItemsStat.data.length > 0 ? (
        <CSVLink
          data={formatRestaurantItemsStat(restaurantItemsStat.data)}
          headers={restaurantItemsCSVHeaders}
          filename='Restaurant Items Stat'
        >
          Restaurant items stat <FiDownload />
        </CSVLink>
      ) : restaurantItemsStat.isLoading ? (
        <p>Restaurant items stat loading...</p>
      ) : (
        <p>No restaurant items stat found</p>
      )}

      {reviewStat.data.length > 0 ? (
        <CSVLink
          data={reviewStat.data}
          headers={reviewStatCSVHeaders}
          filename='Review stat'
        >
          Review stat <FiDownload />
        </CSVLink>
      ) : reviewStat.isLoading ? (
        <p>Review stat loading...</p>
      ) : (
        <p>No review stat found</p>
      )}
    </section>
  );
}
