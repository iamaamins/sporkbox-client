import Link from 'next/link';
import Image from 'next/image';
import ActionModal from './ActionModal';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { HiBadgeCheck } from 'react-icons/hi';
import Buttons from '@components/layout/Buttons';
import { CustomAxiosError, Vendor } from 'types';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import { FormEvent, useEffect, useState } from 'react';
import styles from './Restaurant.module.css';
import {
  axiosInstance,
  updateVendors,
  showErrorAlert,
  showSuccessAlert,
  numberToUSD,
} from '@lib/utils';
import { useAlert } from '@context/Alert';
import ReorderAbleItems from './ReorderAbleItems';
import ModalContainer from '@components/layout/ModalContainer';

export default function Restaurant() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [action, setAction] = useState('');
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<Vendor>();
  const [reorderItems, setReorderItems] = useState(false);
  const [isUpdatingVendorStatus, setIsUpdatingVendorStatus] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>();

  // Get the restaurant
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      setVendor(
        vendors.data.find(
          (vendor) => vendor.restaurant._id === router.query.restaurant
        )
      );
    }
  }, [vendors, router.isReady]);

  // Check if desktop
  useEffect(() => {
    const windowWidth = window.innerWidth;
    setIsDesktop(windowWidth > 428);
  }, []);

  function initiateStatusUpdate(e: FormEvent) {
    setShowStatusUpdateModal(true);
    setAction(e.currentTarget.textContent!);
  }

  async function updateStatus() {
    try {
      setIsUpdatingVendorStatus(true);
      const response = await axiosInstance.patch(
        `/vendors/${vendor?._id}/change-vendor-status`,
        {
          action,
        }
      );
      updateVendors(response.data, setVendors);
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingVendorStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  async function updateItemsIndex() {
    if (!vendor) return;
    const reorderedItems = vendor.restaurant.items.map((item, index) => ({
      _id: item._id,
      index,
    }));

    try {
      const response = await axiosInstance.patch(
        `/restaurants/${vendor.restaurant._id}/update-items-index`,
        { reorderedItems }
      );
      setReorderItems(false);
      showSuccessAlert(response.data, setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  return (
    <section className={styles.restaurant}>
      {vendors.isLoading && <h2>Loading...</h2>}
      {!vendors.isLoading && !vendor && <h2>No restaurant found</h2>}
      {vendor && (
        <>
          <div className={styles.details_and_items}>
            <div className={styles.details}>
              <div className={styles.restaurant_details}>
                <h2 className={styles.restaurant_name}>
                  {vendor.restaurant.name}
                </h2>
                <p>
                  <span>Contact:</span> {vendor.firstName} {vendor.lastName}
                </p>
                <p>
                  <span>Email:</span> {vendor.email}
                </p>
                <p>
                  <span>Address:</span>{' '}
                  {vendor.restaurant.address.addressLine2 ? (
                    <>
                      {vendor.restaurant.address.addressLine1},{' '}
                      {vendor.restaurant.address.addressLine2},{' '}
                      {vendor.restaurant.address.city},{' '}
                      {vendor.restaurant.address.state}{' '}
                      {vendor.restaurant.address.zip}
                    </>
                  ) : (
                    <>
                      {vendor.restaurant.address.addressLine1},{' '}
                      {vendor.restaurant.address.city},{' '}
                      {vendor.restaurant.address.state}{' '}
                      {vendor.restaurant.address.zip}
                    </>
                  )}
                </p>
              </div>
              <div className={styles.buttons}>
                <Buttons
                  linkText='Add item'
                  initiateStatusUpdate={initiateStatusUpdate}
                  buttonText={
                    vendor.status === 'ARCHIVED' ? 'Activate' : 'Archive'
                  }
                  href={`/admin/restaurants/${vendor.restaurant._id}/add-item`}
                />
                <Link
                  href={`/admin/restaurants/${vendor.restaurant._id}/edit-restaurant`}
                >
                  <a className={styles.edit_restaurant_button}>Edit details</a>
                </Link>
              </div>
            </div>
            {vendor.restaurant.items.length > 0 && (
              <>
                <div className={styles.items_header}>
                  <h2 className={styles.items_title}>Items</h2>
                  {isDesktop && (
                    <>
                      {reorderItems ? (
                        <div className={styles.reorder_actions}>
                          <button onClick={updateItemsIndex}>Save order</button>
                          <button onClick={() => setReorderItems(false)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p
                          className={styles.reorder_button}
                          onClick={() => setReorderItems(true)}
                        >
                          Reorder items
                        </p>
                      )}
                    </>
                  )}
                </div>
                {isDesktop && reorderItems ? (
                  <ReorderAbleItems vendor={vendor} setVendor={setVendor} />
                ) : (
                  <div className={styles.items}>
                    {vendor.restaurant.items.map((item) => (
                      <div key={item._id}>
                        <Link
                          href={`/admin/restaurants/${vendor.restaurant._id}/${item._id}`}
                        >
                          <a className={styles.item}>
                            <div className={styles.item_details}>
                              <p className={styles.name}>
                                {item.name}
                                {item.status === 'ACTIVE' ? (
                                  <HiBadgeCheck />
                                ) : (
                                  <RiDeleteBack2Fill
                                    className={styles.archive_icon}
                                  />
                                )}
                              </p>
                              <p className={styles.price}>
                                {numberToUSD(item.price)}
                              </p>
                              <p className={styles.description}>
                                {item.description}
                              </p>
                            </div>

                            <div className={styles.item_image}>
                              <Image
                                src={item.image || vendor.restaurant.logo}
                                width={16}
                                height={10}
                                objectFit='cover'
                                layout='responsive'
                              />
                            </div>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <ModalContainer
            showModalContainer={showStatusUpdateModal}
            setShowModalContainer={setShowStatusUpdateModal}
            component={
              <ActionModal
                action={action}
                name={vendor.restaurant.name}
                performAction={updateStatus}
                isPerformingAction={isUpdatingVendorStatus}
                setShowActionModal={setShowStatusUpdateModal}
              />
            }
          />
        </>
      )}
    </section>
  );
}
