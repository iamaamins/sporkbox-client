import { groupBy } from "@utils/index";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "@styles/admin/Filters.module.css";
import { IFilterProps, IFiltersData, IOrdersGroup } from "types";

export default function Filters({
  orders,
  showFilters,
  setFilteredOrders,
}: IFilterProps) {
  // Initial state
  const initialState = {
    category: "",
    subCategory: "",
  };
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

  // Group active order when category changes
  useEffect(() => {
    {
      category === "companyName" &&
        setCategoryGroups(groupBy(category, orders, "orders"));
    }

    {
      category === "restaurantName" &&
        setCategoryGroups(groupBy(category, orders, "orders"));
    }

    {
      category === "deliveryDate" &&
        setCategoryGroups(groupBy(category, orders, "orders"));
    }

    {
      category === "all" && setFilteredOrders([]);
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
    <div className={`${styles.filters} ${showFilters && styles.show_filters}`}>
      <select name="category" value={category} onChange={handleChange}>
        <option hidden aria-hidden>
          Category
        </option>
        <option value="all">All</option>
        <option value="companyName">Company</option>
        <option value="restaurantName">Restaurant</option>
        <option value="deliveryDate">Delivery date</option>
      </select>

      <select
        name="subCategory"
        value={subCategory}
        onChange={handleChange}
        className={category === "all" ? styles.hide_select : ""}
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
