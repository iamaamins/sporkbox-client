import { useEffect, useState } from 'react';
import styles from './Review.module.css';
import {
  axiosInstance,
  dateToText,
  getPastDate,
  showErrorAlert,
} from '@lib/utils';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { useUser } from '@context/User';

type Review = {
  isLoading: boolean;
  data: {
    reviews: {
      _id: string;
      date: string;
      restaurant: string;
      item: string;
      rating: number;
      comment: string;
    }[];
    reviewCount: number;
    averageRating: number;
  } | null;
};

export default function Review() {
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const [period, setPeriod] = useState('7d');
  const [range, setRange] = useState({
    start: '',
    end: '',
  });
  const [review, setReview] = useState<Review>({ isLoading: true, data: null });

  useEffect(() => {
    async function getReviewData(start: string, end: string) {
      try {
        const response = await axiosInstance.get(
          `/restaurants/items/review-stat/${start}/${end}`
        );

        setReview({ isLoading: false, data: response.data });
      } catch (err) {
        setReview((prevState) => ({ ...prevState, isLoading: false }));
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
    if (isAdmin && start && end) getReviewData(start, end);
  }, [isAdmin, period, range]);

  return (
    <section className={styles.container}>
      <h2>Review</h2>
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
      {review.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        review.data && (
          <div className={styles.tables}>
            {review.data.reviewCount > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Number of reviews</th>
                      <th>Average rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{review.data.reviewCount}</td>
                      <td>{review.data.averageRating.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Restaurant</th>
                      <th>Item</th>
                      <th>Rating</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.data.reviews.map((el) => (
                      <tr key={el._id}>
                        <td>{dateToText(el.date)}</td>
                        <td>{el.restaurant}</td>
                        <td>{el.item}</td>
                        <td>{el.rating}</td>
                        <td>{el.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className={styles.message}>No reviews found</p>
            )}
          </div>
        )
      )}
    </section>
  );
}
