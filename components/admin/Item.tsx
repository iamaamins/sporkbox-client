import Image from 'next/image';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { CustomAxiosError, Item as ItemType, Vendor } from 'types';
import { FormEvent, useEffect, useState } from 'react';
import {
  axiosInstance,
  formatAddons,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
  splitTags,
  updateVendors,
} from '@lib/utils';
import ActionModal from './ActionModal';
import Buttons from '@components/layout/Buttons';
import styles from './Item.module.css';
import ModalContainer from '@components/layout/ModalContainer';

export default function Item() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setVendors } = useData();
  const [item, setItem] = useState<ItemType>();
  const [vendor, setVendor] = useState<Vendor>();
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: '',
    item: {
      name: '',
    },
  });
  const [isUpdatingItemStatus, setIsUpdatingItemStatus] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

  // Get the item
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the vendor
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );

      if (vendor) {
        // Update states
        setVendor(vendor);

        setItem(
          vendor.restaurant.items.find((item) => item._id === router.query.item)
        );
      }
    }
  }, [vendors, router.isReady]);

  // Initiate status update
  function initiateStatusUpdate(e: FormEvent, itemName: string) {
    // Update states
    setShowStatusUpdateModal(true);
    setStatusUpdatePayload({
      action: e.currentTarget.textContent!,
      item: {
        name: itemName,
      },
    });
  }

  // Update item status
  async function updateStatus() {
    try {
      // Show loader
      setIsUpdatingItemStatus(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/restaurants/${router.query.restaurant}/${router.query.item}/change-item-status`,
        { action: statusUpdatePayload.action }
      );

      // Updated vendors
      updateVendors(response.data, setVendors);

      // Show success alert
      showSuccessAlert('Status updated', setAlerts);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove loader and close modal
      setIsUpdatingItemStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  return (
    <section className={styles.item}>
      {vendors.isLoading && <h2>Loading...</h2>}

      {!vendors.isLoading && !item && <h2>No item found</h2>}

      {vendor && item && (
        <>
          <div className={styles.cover_image}>
            <Image
              src={item.image || vendor.restaurant.logo}
              width={16}
              height={10}
              objectFit='cover'
              layout='responsive'
            />
          </div>

          <div className={styles.item_details}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.price}>{numberToUSD(item.price)}</p>
            <p className={styles.tags}>
              {splitTags(item.tags).map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </p>

            {item.optionalAddons.addons && (
              <>
                <p className={styles.title}>
                  Optional addons - {item.optionalAddons.addable} addable
                </p>
                <p className={styles.ingredients}>
                  {formatAddons(item.optionalAddons.addons).join(', ')}
                </p>
              </>
            )}

            {item.requiredAddons.addons && (
              <>
                <p className={styles.title}>
                  Required addons - {item.requiredAddons.addable} addable
                </p>
                <p className={styles.ingredients}>
                  {formatAddons(item.requiredAddons.addons).join(', ')}
                </p>
              </>
            )}

            {item.removableIngredients && (
              <div>
                <p className={styles.title}>Removable ingredients</p>
                <p className={styles.ingredients}>
                  {item.removableIngredients}
                </p>
              </div>
            )}

            {/* Buttons */}
            <Buttons
              initiateStatusUpdate={(e) => initiateStatusUpdate(e, item.name)}
              linkText='Edit details'
              buttonText={item.status === 'ARCHIVED' ? 'Activate' : 'Archive'}
              href={`/admin/restaurants/${router.query.restaurant}/${router.query.item}/edit-item`}
            />
          </div>
        </>
      )}
      <ModalContainer
        showModalContainer={showStatusUpdateModal}
        setShowModalContainer={setShowStatusUpdateModal}
        component={
          <ActionModal
            action={statusUpdatePayload.action}
            name={statusUpdatePayload.item.name}
            performAction={updateStatus}
            isPerformingAction={isUpdatingItemStatus}
            setShowActionModal={setShowStatusUpdateModal}
          />
        }
      />
    </section>
  );
}
