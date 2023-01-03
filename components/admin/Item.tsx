import { IItem } from "types";
import Image from "next/image";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import {
  axiosInstance,
  formatCurrencyToUSD,
  updateVendors,
} from "@utils/index";
import ActionModal from "./ActionModal";
import Buttons from "@components/layout/Buttons";
import styles from "@styles/admin/Item.module.css";
import ModalContainer from "@components/layout/ModalContainer";

export default function Item() {
  const router = useRouter();
  const { vendors, setVendors } = useData();
  const [item, setItem] = useState<IItem>();
  const [statusUpdatePayload, setStatusUpdatePayload] = useState({
    action: "",
    item: {
      name: "",
    },
  });
  const [isUpdatingItemStatus, setIsUpdatingItemStatus] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

  // Get the item
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      setItem(
        vendors.data
          .find((vendor) => vendor.restaurant._id === router.query.restaurant)
          ?.restaurant.items.find((item) => item._id === router.query.item)
      );
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
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove loader and close modal
      setIsUpdatingItemStatus(false);
      setShowStatusUpdateModal(false);
    }
  }

  return (
    <section className={styles.item}>
      {!item && <h2>No item found</h2>}

      {item && (
        <>
          <div className={styles.cover_image}>
            <Image
              src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              width={16}
              height={10}
              layout="responsive"
              objectFit="cover"
            />
          </div>

          <div className={styles.item_details}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.price}>{formatCurrencyToUSD(item.price)}</p>
            <p className={styles.tags}>
              {item.tags.split(",").map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </p>

            {/* Buttons */}
            <Buttons
              initiateStatusUpdate={(e) => initiateStatusUpdate(e, item.name)}
              linkText="Edit details"
              buttonText={item.status === "ARCHIVED" ? "Activate" : "Archive"}
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
