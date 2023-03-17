import Image from "next/image";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import styles from "@styles/generic/Order.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import { IAxiosError, ICustomerFavoriteItem, ICustomerOrder } from "types";
import {
  axiosInstance,
  convertDateToText,
  formatCurrencyToUSD,
  handleRemoveFromFavorite,
  showErrorAlert,
  showSuccessAlert,
} from "@utils/index";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function Order() {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [comment, setComment] = useState<string>("");
  const [order, setOrder] = useState<ICustomerOrder>();
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favoriteItem, setFavoriteItem] = useState<ICustomerFavoriteItem>();
  const {
    customerAllOrders,
    customerFavoriteItems,
    setCustomerFavoriteItems,
    setCustomerDeliveredOrders,
  } = useData();

  // Find the order
  useEffect(() => {
    if (customerAllOrders.length > 0 && router.isReady) {
      const order = customerAllOrders.find(
        (customerOrder) => customerOrder._id === router.query.order
      );

      // Update state if the order is found
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

  // Handle add to favorite
  async function handleAddToFavorite() {
    try {
      // Make request to backend
      const response = await axiosInstance.post(`/favorites/add-to-favorite`, {
        itemId: order?.item._id,
        restaurantId: order?.restaurant._id,
      });

      // Update state
      setCustomerFavoriteItems((currState) => ({
        ...currState,
        data: [...currState.data, response.data],
      }));
      // Show success alert
      showSuccessAlert("Added to favorite", setAlerts);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    }
  }

  // Stars array
  const stars = [];

  // Create stars array
  for (let i = 0; i < 5; i++) {
    stars.push(
      <AiFillStar
        key={i + 1}
        onClick={() => setRating(i + 1)}
        className={` ${styles.star} ${i < rating && styles.filled}`}
      />
    );
  }

  // Handle change comment
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    // Update comment state
    setComment(e.target.value);
  }

  // Handle add review
  async function handleAddReview(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Make request to the backend
      const response = await axiosInstance.post(
        `/restaurants/${order?.restaurant._id}/${order?.item._id}/add-a-review`,
        {
          rating,
          comment,
          orderId: order?._id,
        }
      );

      // Create updated order
      const updatedCustomerDeliveredOrder = response.data;

      // Update customer delivered orders
      setCustomerDeliveredOrders((currState) => ({
        ...currState,
        data: currState.data.map((customerDeliveredOrder) => {
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

      // Show success alert
      showSuccessAlert("Review added", setAlerts);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Update state
      setIsLoading(false);
    }
  }

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
                layout="responsive"
                objectFit="cover"
              />
            </div>

            <div className={styles.details}>
              {order.status === "PROCESSING" && (
                <>
                  <p>
                    Your order for{" "}
                    <span>
                      {order.item.quantity} {order.item.name} -{" "}
                      {formatCurrencyToUSD(order.item.total)}
                    </span>{" "}
                    from <span>{order.restaurant.name}</span> is currently{" "}
                    <span>{order.status.toLowerCase()}</span>. The order will be
                    delivered on{" "}
                    <span>{convertDateToText(order.delivery.date)}</span> -{" "}
                    <span>{order.company.shift}</span>.
                  </p>

                  {order.item.addedIngredients && (
                    <>
                      <p className={styles.title}>Added ingredients</p>
                      <p className={styles.ingredients}>
                        {order.item.addedIngredients}
                      </p>
                    </>
                  )}

                  {order.item.removedIngredients && (
                    <>
                      <p className={styles.title}>Removed ingredients</p>
                      <p className={styles.ingredients}>
                        {order.item.removedIngredients}
                      </p>
                    </>
                  )}

                  <a href="mailto:portland@sporkbytes.com">Contact support</a>
                </>
              )}

              {order.status === "DELIVERED" && (
                <>
                  <p>
                    Your order for{" "}
                    <span>
                      {order.item.quantity} {order.item.name}
                    </span>{" "}
                    from <span>{order.restaurant.name}</span> was{" "}
                    <span>{order.status.toLowerCase()}</span> on{" "}
                    <span>{convertDateToText(order.delivery.date)}</span> -{" "}
                    <span>{order.company.shift}</span>.
                  </p>

                  {order.item.addedIngredients && (
                    <>
                      <p className={styles.title}>Added ingredients</p>
                      <p className={styles.ingredients}>
                        {order.item.addedIngredients}
                      </p>
                    </>
                  )}

                  {order.item.removedIngredients && (
                    <>
                      <p className={styles.title}>Removed ingredients</p>
                      <p className={styles.ingredients}>
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
                          id="comment"
                          value={comment}
                          onChange={handleChange}
                        />

                        <SubmitButton
                          text="Submit review"
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
