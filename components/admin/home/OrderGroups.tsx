import { FormEvent, useRef, useState } from 'react';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import OrderGroupRow from './OrderGroupRow';
import styles from './OrderGroups.module.css';
import ActionButton from '@components/layout/ActionButton';
import {
  axiosInstance,
  dateToText,
  getAddonIngredients,
  showErrorAlert,
} from '@lib/utils';
import {
  CustomAxiosError,
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

type Props = {
  slug: string;
  title: string;
  orderGroups: OrderGroup[];
};

export default function OrderGroups({ slug, title, orderGroups }: Props) {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const csvLink = useRef<CSVLink>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [csvOrderGroup, setCSVOrderGroup] = useState<OrderGroup>();
  const [orderCSVFilename, setOrderCSVFilename] = useState('');
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [labelFilters, setLabelFilters] = useState<LabelFilters>();
  const [orderCSVData, setOrderCSVData] = useState<OrderData[]>([]);
  const [downloadAbles, setDownloadAbles] = useState<DownloadAbles>();
  const { allUpcomingOrders, allDeliveredOrders, setAllDeliveredOrders } =
    useData();
  const [sorted, setSorted] = useState<SortedOrderGroups>({
    byCompany: false,
    byDeliveryDate: false,
  });

  async function handleLoadAllDeliveredOrders() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/orders/delivered/0`);
      setAllDeliveredOrders(response.data);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateAndDownloadLabels(
    e: FormEvent,
    selectedRestaurants: string[]
  ) {
    e.preventDefault();
    if (!labelFilters) return;
    const orders = [];
    for (const group of orderGroups) {
      if (
        group.company.code === labelFilters.companyCode &&
        group.deliveryDate === labelFilters.deliveryDate
      ) {
        orders.push(...group.orders);
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
              required: getAddonIngredients(order.item.requiredAddons),
              removed: getAddonIngredients(order.item.removedIngredients),
            },
          });
        }
      }
    }
    labels.sort((a, b) => {
      const restaurantComp = a.restaurant.localeCompare(b.restaurant);
      if (restaurantComp) return restaurantComp;
      return a.item.name.localeCompare(b.item.name);
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
                  <OrderGroupRow
                    key={index}
                    slug={slug}
                    orderGroup={orderGroup}
                    orderGroups={orderGroups}
                    setShowModal={setShowModal}
                    setRestaurants={setRestaurants}
                    setLabelFilters={setLabelFilters}
                    setCSVOrderGroup={setCSVOrderGroup}
                    setDownloadAbles={setDownloadAbles}
                  />
                ))}
              </tbody>
            </table>
            {router.pathname === '/admin/orders' &&
              orderGroups.length === 25 && (
                <span className={styles.load_all}>
                  <ActionButton
                    buttonText='Load all orders'
                    isLoading={isLoading}
                    handleClick={handleLoadAllDeliveredOrders}
                  />
                </span>
              )}
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
