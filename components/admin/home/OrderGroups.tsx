import { FormEvent, useRef, useState } from 'react';
import { useData } from '@context/Data';
import styles from './OrderGroups.module.css';
import { dateToMS, dateToText, getAddonIngredients } from '@lib/utils';
import {
  DownloadAbles,
  LabelFilters,
  Order,
  OrderData,
  OrderGroup,
  SortedOrderGroups,
} from 'types';
import ModalContainer from '@components/layout/ModalContainer';
import { pdf } from '@react-pdf/renderer';
import Labels from '../layout/Labels';
import SelectRestaurants from './SelectRestaurants';
import {
  formatOrderDataToCSV,
  createOrderCSVFileName,
  orderCSVHeaders,
} from '@lib/csv';
import { CSVLink } from 'react-csv';
import SortOrderGroups from './SortOrderGroups';
import { FiDownload } from 'react-icons/fi';
import Link from 'next/link';

type Props = {
  slug: string;
  title: string;
  orderGroups: OrderGroup[];
};

export default function OrderGroups({ slug, title, orderGroups }: Props) {
  const csvLink = useRef<CSVLink>(null);
  const [showModal, setShowModal] = useState(false);
  const [csvOrderGroup, setCSVOrderGroup] = useState<OrderGroup>();
  const [orderCSVFilename, setOrderCSVFilename] = useState('');
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [labelFilters, setLabelFilters] = useState<LabelFilters>();
  const [orderCSVData, setOrderCSVData] = useState<OrderData[]>([]);
  const [downloadAbles, setDownloadAbles] = useState<DownloadAbles>();
  const { allUpcomingOrders, allDeliveredOrders } = useData();
  const [sorted, setSorted] = useState<SortedOrderGroups>({
    byCompany: false,
    byDeliveryDate: false,
  });

  async function generateAndDownloadLabels(
    e: FormEvent,
    selectedRestaurants: string[]
  ) {
    e.preventDefault();
    if (!labelFilters) return;
    let orders: Order[] = [];
    for (const group of orderGroups) {
      if (
        group.company.code === labelFilters.companyCode &&
        group.deliveryDate === labelFilters.deliveryDate
      ) {
        orders = group.orders;
      }
    }

    const labels = [];
    for (const order of orders) {
      if (selectedRestaurants.includes(order.restaurant.name)) {
        for (let i = 0; i < order.item.quantity; i++) {
          labels.push({
            customer: {
              firstName: order.customer.firstName,
              lastName: order.customer.lastName,
              shift: order.company.shift,
            },
            restaurant: order.restaurant.name,
            item: {
              name: order.item.name,
              optional: getAddonIngredients(order.item.optionalAddons),
              requiredOne: getAddonIngredients(order.item.requiredAddonsOne),
              requiredTwo: getAddonIngredients(order.item.requiredAddonsTwo),
              removed: getAddonIngredients(order.item.removedIngredients),
            },
          });
        }
      }
    }
    labels.sort((a, b) => {
      const restaurantComp = a.restaurant.localeCompare(b.restaurant);
      if (restaurantComp) return restaurantComp;

      const itemComp = a.item.name.localeCompare(b.item.name);
      if (itemComp) return itemComp;

      return a.customer.lastName.localeCompare(b.customer.lastName);
    });

    const blob = await pdf(<Labels labels={labels} />).toBlob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Labels - ${dateToText(labelFilters.deliveryDate)}.pdf`;
    a.click();
    setShowModal(false);
  }

  async function generateAndDownloadCSV(
    e: FormEvent,
    selectedRestaurants: string[]
  ) {
    e.preventDefault();
    if (!csvOrderGroup) return;
    const orders: Order[] = [];
    for (const order of csvOrderGroup.orders) {
      if (selectedRestaurants.includes(order.restaurant.name)) {
        orders.push(order);
      }
    }
    const updatedOrderGroup = { ...csvOrderGroup, orders };
    setOrderCSVData(formatOrderDataToCSV(updatedOrderGroup));
    setOrderCSVFilename(createOrderCSVFileName(updatedOrderGroup));

    setTimeout(() => {
      // @ts-ignore
      csvLink.current?.link.click();
    });
    setShowModal(false);
  }

  function selectRestaurants(
    orderGroup: OrderGroup,
    downloadAbles: DownloadAbles
  ) {
    const companyCode = orderGroup.company.code;
    const deliveryDate = orderGroup.deliveryDate;

    const restaurants = [];
    for (const group of orderGroups) {
      if (
        group.company.code === companyCode &&
        group.deliveryDate === deliveryDate
      ) {
        restaurants.push(...group.restaurants);
      }
    }

    const uniqueRestaurants: string[] = [];
    for (const restaurant of restaurants) {
      if (!uniqueRestaurants.includes(restaurant)) {
        uniqueRestaurants.push(restaurant);
      }
    }

    downloadAbles === 'CSV' && setCSVOrderGroup(orderGroup);
    downloadAbles === 'labels' &&
      setLabelFilters({ companyCode, deliveryDate });

    setRestaurants(uniqueRestaurants);
    setDownloadAbles(downloadAbles);
    setShowModal(true);
  }

  return (
    <>
      <section className={styles.orders_groups}>
        {(allUpcomingOrders.isLoading || allDeliveredOrders.isLoading) && (
          <h2>Loading...</h2>
        )}
        {!allUpcomingOrders.isLoading &&
          !allDeliveredOrders.isLoading &&
          orderGroups.length === 0 && <h2>No {title.toLowerCase()}</h2>}

        {orderGroups.length > 0 && (
          <>
            <div className={styles.orders_top}>
              <h2>{title}</h2>
              <SortOrderGroups
                setSorted={setSorted}
                orderGroups={orderGroups}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Delivery date</th>
                  <th className={styles.hide_on_mobile}>Company code</th>
                  <th className={styles.hide_on_mobile}>Restaurant</th>
                  <th>Headcount</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderGroups.map((orderGroup, index) => (
                  <tr key={index} className={styles.orders_group_row}>
                    <td className={styles.important}>
                      <Link
                        href={`/admin/${slug}/${
                          orderGroup.company.code
                        }/${dateToMS(orderGroup.deliveryDate)}`}
                      >
                        <a>{dateToText(orderGroup.deliveryDate)} </a>
                      </Link>
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {orderGroup.company.code}
                    </td>
                    <td
                      className={`${styles.restaurants} ${styles.hide_on_mobile}`}
                    >
                      {orderGroup.restaurants.map((restaurant) => (
                        <span key={restaurant}>{restaurant}</span>
                      ))}
                    </td>
                    <td>{orderGroup.customers.length}</td>
                    <td>{orderGroup.orders.length}</td>
                    <td>
                      <span
                        onClick={() => selectRestaurants(orderGroup, 'labels')}
                      >
                        Labels <FiDownload />
                      </span>
                      <span
                        onClick={() => selectRestaurants(orderGroup, 'CSV')}
                      >
                        CSV <FiDownload />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {orderCSVData && (
          <CSVLink
            // @ts-ignore
            ref={csvLink}
            data={orderCSVData}
            headers={orderCSVHeaders}
            filename={orderCSVFilename}
          />
        )}
      </section>
      <ModalContainer
        showModalContainer={showModal}
        setShowModalContainer={setShowModal}
        component={
          <SelectRestaurants
            downloadAbles={downloadAbles}
            restaurants={restaurants}
            generateAndDownloadDoc={
              downloadAbles === 'CSV'
                ? generateAndDownloadCSV
                : generateAndDownloadLabels
            }
          />
        }
      />
    </>
  );
}
