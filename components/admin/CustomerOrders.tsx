import { ICustomerOrdersProps } from "types";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

export default function CustomerOrders({
  orders,
  orderStatus,
}: ICustomerOrdersProps) {
  return (
    <>
      <h2>{orderStatus} orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Restaurant</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{convertDateToText(order.delivery.date)}</td>
              <td>{order.item.name}</td>
              <td>{order.item.quantity}</td>
              <td>{order.restaurant.name}</td>
              <td>{formatCurrencyToUSD(order.item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
