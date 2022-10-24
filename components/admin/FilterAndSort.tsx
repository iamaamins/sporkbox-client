import { convertDateToMS, groupBy } from "@utils/index";
import styles from "@styles/admin/FilterAndSort.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { IFilterAndSortProps, IFiltersData, IOrdersGroup } from "types";

export default function FilterAndSort({
  orders,
  showController,
  setFilteredOrders,
}: IFilterAndSortProps) {
  // Initial state
  const initialState = {
    category: "",
    subCategory: "",
  };

  // Hooks
  const [filtersData, setFiltersData] = useState<IFiltersData>(initialState);
  const [categoryGroups, setCategoryGroups] = useState<IOrdersGroup[]>([]);

  // Destructure filters data
  const { category, subCategory } = filtersData;

  // Update filtered data when sub category changes
  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (activeOrder) => activeOrder[category as keyof object] === subCategory
      )
    );
  }, [subCategory]);

  // Update filtered data and group of
  // active order when category changes
  useEffect(() => {
    if (
      category === "companyName" ||
      category === "deliveryDate" ||
      category === "restaurantName"
    ) {
      setCategoryGroups(groupBy(category, orders, "orders"));
    }

    if (category === "sortByCompany") {
      setFilteredOrders([]);
      orders.sort((a, b) =>
        a.companyName.localeCompare(b.companyName.toLowerCase())
      );
    }

    if (category === "sortByDeliveryDate") {
      setFilteredOrders([]);
      orders.sort(
        (a, b) =>
          convertDateToMS(a.deliveryDate) - convertDateToMS(b.deliveryDate)
      );
    }
  }, [category]);

  // Handle change
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setFiltersData((currData) => ({
      ...currData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div
      className={`${styles.filter_and_sort} ${
        showController && styles.show_controller
      }`}
    >
      <select name="category" value={category} onChange={handleChange}>
        <option hidden aria-hidden>
          Category
        </option>
        <option value="companyName">Company</option>
        <option value="restaurantName">Restaurant</option>
        <option value="deliveryDate">Delivery date</option>
        <option value="sortByCompany">Sort by company</option>
        <option value="sortByDeliveryDate">Sort by delivery date</option>
      </select>

      <select
        name="subCategory"
        value={subCategory}
        onChange={handleChange}
        className={
          category === "all" ||
          category === "sortByCompany" ||
          category === "sortByDeliveryDate"
            ? styles.hide_subcategory
            : ""
        }
      >
        <option hidden aria-hidden>
          Sub category
        </option>
        {categoryGroups.map((categoryGroup, index) => (
          <option key={index} value={categoryGroup[category] as string}>
            {categoryGroup[category] as string}
          </option>
        ))}
      </select>
    </div>
  );
}
