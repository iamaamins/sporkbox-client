import Image from "next/image";
import { ICustomerFavoriteItem, ICustomerOrder } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useEffect, useState } from "react";
import { convertDateToText } from "@utils/index";
import styles from "@styles/generic/Order.module.css";
import LinkButton from "@components/layout/LinkButton";
import SubmitButton from "@components/layout/SubmitButton";
import { AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import axios from "axios";

export default function Order() {
  // Hooks
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [order, setOrder] = useState<ICustomerOrder>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { customerAllOrders, customerFavoriteItems, setCustomerFavoriteItems } =
    useData();
  const [favoriteItem, setFavoriteItem] = useState<ICustomerFavoriteItem>();

  // Find the order
  useEffect(() => {
    if (customerAllOrders.length > 0 && router.isReady) {
      const order = customerAllOrders.find(
        (customerAllOrder) => customerAllOrder._id === router.query.order
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
        customerFavoriteItems.find(
          (customerFavoriteItem) =>
            customerFavoriteItem.itemId === order.item._id
        )
      );
    }
  }, [customerFavoriteItems, order]);

  // Handle add to favorite
  async function handleAddToFavorite() {
    try {
      // Make request to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/add`,
        {
          itemId: order?.item._id,
          restaurantId: order?.restaurantId,
        },
        { withCredentials: true }
      );

      // Update state
      setCustomerFavoriteItems(
        (currCustomerFavoriteItems: ICustomerFavoriteItem[]) => [
          ...currCustomerFavoriteItems,
          res.data,
        ]
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Handle remove from favorite
  async function handleRemoveFromFavorite() {
    try {
      // Make request to backend
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${favoriteItem?._id}/remove`,
        { withCredentials: true }
      );

      // Update state
      setCustomerFavoriteItems(
        (currCustomerFavoriteItems: ICustomerFavoriteItem[]) =>
          currCustomerFavoriteItems.filter(
            (currCustomerFavoriteItem) =>
              currCustomerFavoriteItem._id !== favoriteItem?._id
          )
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.order}>
      {!order && <h2>No order found</h2>}
      {order && (
        <>
          <div className={styles.order_top}>
            <h2 className={styles.order_title}>Order summary</h2>
            {favoriteItem ? (
              <AiTwotoneStar onClick={handleRemoveFromFavorite} />
            ) : (
              <AiOutlineStar onClick={handleAddToFavorite} />
            )}
          </div>

          <div className={styles.cover_image_and_details}>
            <div className={styles.cover_image}>
              <Image
                src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
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
                      {order.item.quantity} {order.item.name}
                    </span>{" "}
                    from <span>{order.restaurantName}</span> is currently{" "}
                    <span>{order.status.toLowerCase()}</span>. The order will be
                    delivered on{" "}
                    <span>{convertDateToText(order.deliveryDate)}</span>
                  </p>

                  <LinkButton text="Contact sales" href="/contact" />
                </>
              )}

              {order.status === "DELIVERED" && (
                <>
                  <p>
                    Your order for{" "}
                    <span>
                      {order.item.quantity} {order.item.name}
                    </span>{" "}
                    from <span>{order.restaurantName}</span> was{" "}
                    <span>{order.status.toLowerCase()}</span> on{" "}
                    <span>{convertDateToText(order.deliveryDate)}</span>.
                  </p>

                  <p className={styles.review_title}>Leave a review</p>

                  <form action="submit">
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />

                    <SubmitButton
                      text="Submit review"
                      isLoading={isLoading}
                      isDisabled={isDisabled}
                    />
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
