import { convertDateToMS } from "@utils/index";
import { useEffect, useState } from "react";
import { ISortOrdersGroupsProps } from "types";
import styles from "@styles/admin/SortOrdersGroups.module.css";

export default function SortOrdersGroups({
  setSorted,
  ordersGroups,
}: ISortOrdersGroupsProps) {
  // Hooks
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (category === "company") {
      ordersGroups.sort((a, b) =>
        a.company.name.toLowerCase().localeCompare(b.company.name.toLowerCase())
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
          Sort orders
        </option>
        <option value="company">By company</option>
        <option value="deliveryDate">By delivery date</option>
      </select>
    </div>
  );
}
