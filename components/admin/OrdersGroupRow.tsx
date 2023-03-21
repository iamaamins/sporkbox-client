import Link from "next/link";
import { CSVLink } from "react-csv";
import { IOrdersGroupRowProps } from "types";
import { FiDownload } from "react-icons/fi";
import {
  convertDateToMS,
  convertDateToText,
  createSlug,
  formatCurrencyToUSD,
} from "@utils/index";
import styles from "@styles/admin/OrdersGroupRow.module.css";

export default function OrdersGroupRow({
  slug,
  ordersGroup,
}: IOrdersGroupRowProps) {
  // CSV data
  const data = ordersGroup.orders.map((order) => ({
    tags: order.item.tags,
    itemName: order.item.name,
    companyName: order.company.name,
    lastName: order.customer.lastName,
    customerEmail: order.customer.email,
    description: order.item.description,
    firstName: order.customer.firstName,
    restaurantName: order.restaurant.name,
    price: formatCurrencyToUSD(order.item.total),
    addedIngredients: order.item.addedIngredients,
    removedIngredients: order.item.removedIngredients,
    deliveryDate: convertDateToText(order.delivery.date),
    shift: `${order.company.shift[0].toUpperCase()}${order.company.shift.slice(
      1
    )}`,
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
      label: "Shift",
      key: "shift",
    },
    {
      label: "First name",
      key: "firstName",
    },
    {
      label: "Last name",
      key: "lastName",
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
      label: "Added ingredients",
      key: "addedIngredients",
    },
    {
      label: "Removed ingredients",
      key: "removedIngredients",
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
  const fileName = `${ordersGroup.company.name} - ${
    ordersGroup.deliveryDate.split("T")[0]
  }.csv`;

  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/${slug}/${ordersGroup.company._id}/${convertDateToMS(
            ordersGroup.deliveryDate
          )}`}
        >
          <a>{convertDateToText(ordersGroup.deliveryDate)} </a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{ordersGroup.company.name}</td>
      <td className={styles.shift}>{ordersGroup.company.shift}</td>
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
