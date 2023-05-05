import Link from "next/link";
import Image from "next/image";
import ActionModal from "./ActionModal";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { IAxiosError, IVendor } from "types";
import { HiBadgeCheck } from "react-icons/hi";
import Buttons from "@components/layout/Buttons";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/Restaurant.module.css";
import {
  axiosInstance,
  formatCurrencyToUSD,
  showErrorAlert,
  showSuccessAlert,
  updateVendors,
} from "@utils/index";
import { AxiosError } from "axios";
import { useAlert } from "@context/Alert";
import ModalContainer from "@components/layout/ModalContainer";

export default function Restaurant() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const [action, setAction] = useState("");
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<IVendor>();
  const [isUpdatingVendorStatus, setIsUpdatingVendorStatus] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

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

  // Handle update status
  function initiateStatusUpdate(e: FormEvent) {
    // Update states
    setShowStatusUpdateModal(true);
    setAction(e.currentTarget.textContent!);
  }

  // Update restaurant status
  async function updateStatus() {
    try {
      // Show loader
      setIsUpdatingVendorStatus(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/vendors/${vendor?._id}/change-vendor-status`,
        {
          action,
        }
      );

      // Update vendors with updates status
      updateVendors(response.data, setVendors);

      // Show success alert
      showSuccessAlert("Status updated", setAlerts);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader and close the modal
      setIsUpdatingVendorStatus(false);
      setShowStatusUpdateModal(false);
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
                  <span>Address:</span>{" "}
                  {vendor.restaurant.address.addressLine2 ? (
                    <>
                      {vendor.restaurant.address.addressLine1},{" "}
                      {vendor.restaurant.address.addressLine2},{" "}
                      {vendor.restaurant.address.city},{" "}
                      {vendor.restaurant.address.state}{" "}
                      {vendor.restaurant.address.zip}
                    </>
                  ) : (
                    <>
                      {vendor.restaurant.address.addressLine1},{" "}
                      {vendor.restaurant.address.city},{" "}
                      {vendor.restaurant.address.state}{" "}
                      {vendor.restaurant.address.zip}
                    </>
                  )}
                </p>
              </div>

              {/* Buttons */}
              <div className={styles.buttons}>
                <Buttons
                  linkText="Add item"
                  initiateStatusUpdate={initiateStatusUpdate}
                  buttonText={
                    vendor.status === "ARCHIVED" ? "Activate" : "Archive"
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

            {/* Items */}
            {vendor.restaurant.items.length > 0 && (
              <>
                <h2 className={styles.items_title}>Items</h2>
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
                              {item.status === "ACTIVE" ? (
                                <HiBadgeCheck />
                              ) : (
                                <RiDeleteBack2Fill
                                  className={styles.archive_icon}
                                />
                              )}
                            </p>
                            <p className={styles.price}>
                              {formatCurrencyToUSD(item.price)}
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
                              objectFit="cover"
                              layout="responsive"
                            />
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
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
