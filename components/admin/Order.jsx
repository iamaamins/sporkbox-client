import styles from "@styles/admin/Order.module.css";

export default function Order() {
  return (
    <section className={styles.order}>
      <div className={styles.details}>
        <div className={styles.order_details}>
          <h2>Order #1</h2>
          <p>
            <span>Date:</span> Sep 28, 2022
          </p>
          <p>
            <span>Status:</span> Processing
          </p>

          <p>
            <span>Total:</span> $140
          </p>
          <p>
            <span>Items:</span> Item 1, Item 2
          </p>
          <p>
            <span>Restaurant:</span> Restaurant 1
          </p>
        </div>

        <div className={styles.customer_details}>
          <h2>Customer info</h2>
          <p>
            <span>Name:</span> Customer 1
          </p>
          <p>
            <span>Address:</span> Test address
          </p>
          <p>
            <span>Phone:</span> 123-345-5555
          </p>
          <p>
            <span>Email:</span> customer1@test.com
          </p>
        </div>
      </div>

      <button>Update status</button>
    </section>
  );
}
