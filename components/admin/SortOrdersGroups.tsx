import { convertDateToMS } from "@utils/index";
import { useEffect, useState } from "react";
import { IFilterAndSortProps } from "types";
import styles from "@styles/admin/SortOrdersGroups.module.css";

export default function SortOrdersGroups({
  setSorted,
  ordersGroups,
}: IFilterAndSortProps) {
  // Hooks
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (category === "company") {
      ordersGroups.sort((a, b) =>
        a.companyName.localeCompare(b.companyName.toLowerCase())
      );

      setSorted((currState) => ({
        ...currState,
        byCompany: true,
        byDeliveryDate: false,
      }));
    }

    if (category === "deliveryDate") {
      ordersGroups.sort(
        (a, b) =>
          convertDateToMS(a.deliveryDate) - convertDateToMS(b.deliveryDate)
      );

      setSorted((currState) => ({
        ...currState,
        byCompany: false,
        byDeliveryDate: true,
      }));
    }
  }, [category]);

  return (
    <div className={styles.sort_orders_groups}>
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option hidden aria-hidden>
          Sort orders by
        </option>
        <option value="company">Company</option>
        <option value="deliveryDate">Delivery date</option>
      </select>
    </div>
  );
}
