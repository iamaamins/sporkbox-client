import { IFiltersData, IOrdersGroup, IOrdersProps } from "types";
import Link from "next/link";
import styles from "@styles/admin/Orders.module.css";
import { BsFilter } from "react-icons/bs";
import { ChangeEvent, useEffect, useState } from "react";
import { useData } from "@context/Data";
import { groupBy } from "@utils/index";
import Order from "./Order";

export default function Orders({ title }: IOrdersProps) {
  // Initial state
  const initialState = {
    category: "",
    subCategory: "",
  };
  const { activeOrders } = useData();
  const [showFilters, setShowFilters] = useState(false);
  const [filtersData, setFiltersData] = useState<IFiltersData>(initialState);
  const [categoryGroups, setCategoryGroups] = useState<IOrdersGroup[]>([]);

  // Destructure filters data
  const { category, subCategory } = filtersData;

  // Filter the active orders base on category
  const filteredActiveOrders = activeOrders.filter(
    (activeOrder) => activeOrder[category as keyof object] === subCategory
  );

  // Handle change
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setFiltersData((currData) => ({
      ...currData,
      [e.target.name]: e.target.value,
    }));
  }

  // Group active order when category is changed
  useEffect(() => {
    {
      category === "companyName" &&
        setCategoryGroups(groupBy(category, activeOrders, "orders"));
    }

    {
      category === "restaurantName" &&
        setCategoryGroups(groupBy(category, activeOrders, "orders"));
    }

    {
      category === "deliveryDate" &&
        setCategoryGroups(groupBy(category, activeOrders, "orders"));
    }
  }, [category]);

  return (
    <section className={styles.orders}>
      {/* Title and filter icon */}
      <div className={styles.orders_top}>
        <h2>{title}</h2>
        <div
          className={styles.filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          <BsFilter />
        </div>
      </div>

      {/* Filters */}
      <div className={`${styles.filters} ${showFilters && styles.show}`}>
        <select name="category" value={category} onChange={handleChange}>
          <option hidden aria-hidden>
            Category
          </option>
          <option value="companyName">Company</option>
          <option value="restaurantName">Restaurant</option>
          <option value="deliveryDate">Delivery date</option>
        </select>

        <select name="subCategory" value={subCategory} onChange={handleChange}>
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

      {/* Orders table */}
      <table>
        <thead>
          <tr>
            <th>Order#</th>
            <th className={styles.hide_on_mobile}>Created on</th>
            <th className={styles.hide_on_mobile}>Restaurant</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredActiveOrders.length === 0 ? (
            <>
              {activeOrders.map((order) => (
                <Order order={order} />
              ))}
            </>
          ) : (
            <>
              {filteredActiveOrders.map((order) => (
                <Order order={order} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </section>
  );
}
