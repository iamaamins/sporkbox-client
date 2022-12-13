import Link from "next/link";
import { IOrdersGroupRowProps } from "types";
import { FiDownload } from "react-icons/fi";
import { CSVLink } from "react-csv";
import { convertDateToMS, createSlug } from "@utils/index";
import styles from "@styles/admin/OrdersGroupRow.module.css";

export default function OrdersGroupRow({
  slug,
  ordersGroup,
}: IOrdersGroupRowProps) {
  // CSV data
  const data = ordersGroup.orders.map((order) => ({
    deliveryDate: order.delivery.date,
    companyName: order.company.name,
    firstName: order.customer.firstName,
    lastName: order.customer.lastName,
    customerEmail: order.customer.email,
    restaurantName: order.restaurant.name,
    itemName: order.item.name,
    price: order.item.total,
    tags: order.item.tags,
    description: order.item.description,
  }));

  // CSV headers
  const headers = [
    {
      label: "Delivery date",
      key: "deliveryDate",
    },
    {
      label: "Company",
      key: "companyName",
    },
    {
      label: "Name",
      key: "customerName",
    },
    {
      label: "Email",
      key: "customerEmail",
    },
    {
      label: "Restaurant",
      key: "restaurantName",
    },
    {
      label: "Item",
      key: "itemName",
    },
    {
      label: "Dietary Tags",
      key: "tags",
    },
    {
      label: "Description",
      key: "description",
    },
    {
      label: "Price",
      key: "price",
    },
  ];

  // Filename
  const fileName = `${ordersGroup.companyName} - ${ordersGroup.deliveryDate}`;

  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/${slug}/${createSlug(
            ordersGroup.companyName
          )}/${convertDateToMS(ordersGroup.deliveryDate)}`}
        >
          <a>{ordersGroup.deliveryDate}</a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{ordersGroup.companyName}</td>
      <td className={`${styles.restaurants} ${styles.hide_on_mobile}`}>
        {ordersGroup.restaurants.map((restaurant) => (
          <span key={restaurant}>{restaurant}</span>
        ))}
      </td>
      <td>{ordersGroup.orders.length}</td>
      <td className={styles.action}>
        <CSVLink data={data} headers={headers} filename={fileName}>
          CSV <FiDownload />
        </CSVLink>
      </td>
    </tr>
  );
}
