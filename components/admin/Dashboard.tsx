import Link from "next/link";
import { BsFilter } from "react-icons/bs";
import { useData } from "@context/Data";
import { ChangeEvent, useEffect, useState } from "react";
import LinkButton from "@components/layout/LinkButton";
import styles from "@styles/admin/Dashboard.module.css";
import { convertDateToText, groupBy } from "@utils/index";
import { IActiveOrder, IActiveOrdersGroup, IFiltersData } from "types";

export default function Dashboard() {
  // Initial state
  const initialState = {
    category: "",
    subCategory: "",
  };
  const [showFilters, setShowFilters] = useState(false);
  const [filtersData, setFiltersData] = useState<IFiltersData>(initialState);
  const [categoryGroups, setCategoryGroups] = useState<IActiveOrdersGroup[]>(
    []
  );
  const { activeOrders, scheduledRestaurants, companies } = useData();

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
    if (category === "companyName") {
      setCategoryGroups(groupBy(category, activeOrders, "orders"));
    } else if (category === "restaurantName") {
      setCategoryGroups(groupBy(category, activeOrders, "orders"));
    } else if (category === "deliveryDate") {
      setCategoryGroups(groupBy(category, activeOrders, "orders"));
    }
  }, [category]);

  console.log(categoryGroups);

  return (
    <>
      {activeOrders.length > 0 && (
        <section className={styles.section}>
          <div className={styles.orders_top}>
            <h2>Active orders</h2>
            <div
              className={styles.filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              <BsFilter />
            </div>
          </div>

          <div className={`${styles.filters} ${showFilters && styles.show}`}>
            <select name="category" value={category} onChange={handleChange}>
              <option hidden aria-hidden>
                Category
              </option>
              <option value="companyName">Company</option>
              <option value="restaurantName">Restaurant</option>
              <option value="deliveryDate">Delivery date</option>
            </select>

            <select
              name="subCategory"
              value={subCategory}
              onChange={handleChange}
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

          <div className={styles.active_orders}>
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
                    {/* Active orders */}
                    {activeOrders.map((activeOrder) => (
                      <tr key={activeOrder._id}>
                        <td className={styles.important}>
                          <Link href={`/admin/restaurants/${activeOrder._id}`}>
                            <a>{activeOrder.customerName}</a>
                          </Link>
                        </td>
                        <td className={styles.hide_on_mobile}>
                          {activeOrder.deliveryDate}
                        </td>
                        <td className={styles.hide_on_mobile}>
                          {activeOrder.deliveryDate}
                        </td>
                        <td>{activeOrder.status}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {/* Filtered orders */}
                    {filteredActiveOrders.map((filteredActiveOrder) => (
                      <tr key={filteredActiveOrder._id}>
                        <td className={styles.important}>
                          <Link
                            href={`/admin/restaurants/${filteredActiveOrder._id}`}
                          >
                            <a>{filteredActiveOrder.customerName}</a>
                          </Link>
                        </td>
                        <td className={styles.hide_on_mobile}>
                          {filteredActiveOrder.deliveryDate}
                        </td>
                        <td className={styles.hide_on_mobile}>
                          {filteredActiveOrder.deliveryDate}
                        </td>
                        <td>{filteredActiveOrder.status}</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Scheduled restaurants */}
      {scheduledRestaurants.length > 0 && (
        <section className={styles.section}>
          <h2>Scheduled restaurants</h2>

          <div className={styles.restaurants}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Scheduled on</th>
                </tr>
              </thead>

              <tbody>
                {scheduledRestaurants.map((scheduledRestaurant) => (
                  <tr key={scheduledRestaurant._id}>
                    <td className={styles.important}>
                      <Link
                        href={`/admin/restaurants/${scheduledRestaurant._id}`}
                      >
                        <a>{scheduledRestaurant.name}</a>
                      </Link>
                    </td>
                    <td>
                      {convertDateToText(scheduledRestaurant.scheduledOn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LinkButton href="/admin/schedule-restaurants" text="Schedule more" />
        </section>
      )}

      {/* Companies */}
      {companies && companies.length > 0 && (
        <section className={styles.section}>
          <h2>Companies</h2>

          <div className={styles.companies}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className={styles.hide_on_mobile}>Website</th>
                  <th className={styles.hide_on_mobile}>Code</th>
                  <th>Budget</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td className={styles.important}>
                      <Link href={`/admin/companies/${company._id}`}>
                        <a>{company.name}</a>
                      </Link>
                    </td>
                    <td className={styles.hide_on_mobile}>{company.website}</td>
                    <td className={styles.hide_on_mobile}>{company.code}</td>
                    <td>${company.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LinkButton href="/admin/add-company" text="Add company" />
        </section>
      )}
    </>
  );
}
