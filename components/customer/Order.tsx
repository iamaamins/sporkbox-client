import Image from 'next/image';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import { AiFillStar } from 'react-icons/ai';
import { AiOutlineStar } from 'react-icons/ai';
import styles from './Order.module.css';
import SubmitButton from '@components/layout/SubmitButton';
import { CustomAxiosError, CustomerFavoriteItem, CustomerOrder } from 'types';
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  dateToText,
  numberToUSD,
  handleRemoveFromFavorite,
} from '@lib/utils';
import { FormEvent, useEffect, useState } from 'react';
import ActionButton from '@components/layout/ActionButton';

export default function Order() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [comment, setComment] = useState<string>('');
  const [order, setOrder] = useState<CustomerOrder>();
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favoriteItem, setFavoriteItem] = useState<CustomerFavoriteItem>();
  const {
    customerAllOrders,
    customerFavoriteItems,
    setCustomerFavoriteItems,
    setCustomerUpcomingOrders,
    setCustomerDeliveredOrders,
  } = useData();
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <AiFillStar
        key={i + 1}
        onClick={() => setRating(i + 1)}
        className={` ${styles.star} ${i < rating && styles.filled}`}
      />
    );
  }

  async function handleAddToFavorite() {
    try {
      const response = await axiosInstance.post(`/favorites/add-to-favorite`, {
        itemId: order?.item._id,
        restaurantId: order?.restaurant._id,
      });

      setCustomerFavoriteItems((prevState) => ({
        ...prevState,
        data: [...prevState.data, response.data],
      }));
      showSuccessAlert('Added to favorite', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  async function handleAddReview(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/restaurants/${order?.restaurant._id}/${order?.item._id}/add-a-review`,
        {
          rating,
          comment,
          orderId: order?._id,
        }
      );

      const updatedCustomerDeliveredOrder = response.data;
      setCustomerDeliveredOrders((prevState) => ({
        ...prevState,
        data: prevState.data.map((customerDeliveredOrder) => {
          if (
            customerDeliveredOrder._id === updatedCustomerDeliveredOrder._id
          ) {
            return {
              ...customerDeliveredOrder,
              hasReviewed: updatedCustomerDeliveredOrder.hasReviewed,
            };
          } else {
            return customerDeliveredOrder;
          }
        }),
      }));
      showSuccessAlert('Review added', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelOrder() {
    if (!order) return;
    try {
      setCancellingOrder(true);
      const response = await axiosInstance.patch(`/orders/${order._id}/cancel`);
      setCustomerUpcomingOrders((prevState) => ({
        ...prevState,
        data: prevState.data.filter((el) => el._id !== order._id),
      }));
      console.log(response.data);
      router.push('/dashboard');
      showSuccessAlert(response.data.message, setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setCancellingOrder(false);
    }
  }

  // Find the order
  useEffect(() => {
    if (customerAllOrders.length > 0 && router.isReady) {
      const order = customerAllOrders.find(
        (customerOrder) => customerOrder._id === router.query.order
      );
      if (order) {
        setOrder(order);
      }
    }
  }, [customerAllOrders, router.isReady]);

  // Check if item is a favorite
  useEffect(() => {
    if (order) {
      setFavoriteItem(
        customerFavoriteItems.data.find(
          (customerFavoriteItem) =>
            customerFavoriteItem.item._id === order.item._id
        )
      );
    }
  }, [customerFavoriteItems, order]);

  return (
    <section className={styles.order}>
      {!order && <h2>No order found</h2>}

      {order && (
        <>
          <div className={styles.order_top}>
            <h2 className={styles.order_title}>Order summary</h2>
            <p
              onClick={
                favoriteItem
                  ? () =>
                      handleRemoveFromFavorite(
                        setAlerts,
                        favoriteItem._id,
                        setCustomerFavoriteItems
                      )
                  : handleAddToFavorite
              }
              className={`${styles.not_favorite} ${
                favoriteItem && styles.favorite
              }`}
            >
              Favorite <AiOutlineStar />
            </p>
          </div>

          <div className={styles.cover_image_and_details}>
            <div className={styles.cover_image}>
              <Image
                src={order.item.image}
                width={16}
                height={9}
                layout='responsive'
                objectFit='cover'
              />
            </div>

            <div className={styles.details}>
              {order.status === 'PROCESSING' && (
                <>
                  <p>
                    Your order for{' '}
                    <span>
                      {order.item.quantity} {order.item.name} -{' '}
                      {numberToUSD(order.item.total)}
                    </span>{' '}
                    from <span>{order.restaurant.name}</span> is currently{' '}
                    <span>{order.status.toLowerCase()}</span>. The order will be
                    delivered on <span>{dateToText(order.delivery.date)}</span>{' '}
                    - <span>{order.company.shift}</span>.
                  </p>

                  {order.item.optionalAddons && (
                    <>
                      <p className={styles.title}>Optional addons</p>
                      <p className={styles.addons}>
                        {order.item.optionalAddons}
                      </p>
                    </>
                  )}

                  {order.item.requiredAddons && (
                    <>
                      <p className={styles.title}>Required addons</p>
                      <p className={styles.addons}>
                        {order.item.requiredAddons}
                      </p>
                    </>
                  )}

                  {order.item.removedIngredients && (
                    <>
                      <p className={styles.title}>Removed ingredients</p>
                      <p className={styles.removed_ingredients}>
                        {order.item.removedIngredients}
                      </p>
                    </>
                  )}

                  <div className={styles.buttons}>
                    <a href='mailto:portland@sporkbytes.com'>Contact support</a>

                    <ActionButton
                      buttonText='Cancel order'
                      isLoading={cancellingOrder}
                      handleClick={handleCancelOrder}
                    />
                  </div>
                </>
              )}

              {order.status === 'DELIVERED' && (
                <>
                  <p>
                    Your order for{' '}
                    <span>
                      {order.item.quantity} {order.item.name}
                    </span>{' '}
                    from <span>{order.restaurant.name}</span> was{' '}
                    <span>{order.status.toLowerCase()}</span> on{' '}
                    <span>{dateToText(order.delivery.date)}</span> -{' '}
                    <span>{order.company.shift}</span>.
                  </p>

                  {order.item.optionalAddons && (
                    <>
                      <p className={styles.title}>Optional addons</p>
                      <p className={styles.addons}>
                        {order.item.optionalAddons}
                      </p>
                    </>
                  )}

                  {order.item.requiredAddons && (
                    <>
                      <p className={styles.title}>Required addons</p>
                      <p className={styles.addons}>
                        {order.item.requiredAddons}
                      </p>
                    </>
                  )}

                  {order.item.removedIngredients && (
                    <>
                      <p className={styles.title}>Removed ingredients</p>
                      <p className={styles.removed_ingredients}>
                        {order.item.removedIngredients}
                      </p>
                    </>
                  )}

                  {!order.hasReviewed && (
                    <>
                      <p className={styles.review_title}>Leave a review</p>

                      <div className={styles.ratings}>
                        {stars.map((star) => star)}
                      </div>

                      <form onSubmit={handleAddReview}>
                        <textarea
                          id='comment'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />

                        <SubmitButton
                          text='Submit review'
                          isLoading={isLoading}
                        />
                      </form>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
