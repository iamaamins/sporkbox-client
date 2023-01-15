import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import RestaurantForm from "./RestaurantForm";
import { IAxiosError, IFormData, IVendor } from "types";
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateVendors,
} from "@utils/index";
import styles from "@styles/admin/EditRestaurant.module.css";
import React, { FormEvent, useEffect, useState } from "react";

export default function EditRestaurant() {
  // Initial state
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    zip: "",
    restaurantName: "",
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setVendors } = useData();
  const [vendor, setVendor] = useState<IVendor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const {
    firstName,
    lastName,
    email,
    city,
    state,
    zip,
    logo,
    restaurantName,
    addressLine1,
    addressLine2,
  } = formData;

  // Get the restaurant
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the vendor
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );

      if (vendor) {
        // Vendor details
        const vendorDetails = {
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          email: vendor.email,
          logo: vendor.restaurant.logo,
          restaurantName: vendor.restaurant.name,
          city: vendor.restaurant.address.city,
          state: vendor.restaurant.address.state,
          zip: vendor.restaurant.address.zip,
          addressLine1: vendor.restaurant.address.addressLine1,
        };

        // Update states
        setVendor(vendor);
        setFormData((currState) =>
          vendor.restaurant.address.addressLine2
            ? {
                ...vendorDetails,
                addressLine2: vendor.restaurant.address.addressLine2,
              }
            : { ...currState, ...vendorDetails }
        );
      }
    }
  }, [vendors, router.isReady]);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Append the data
    data.append("file", file as File);
    data.append("firstName", firstName as string);
    data.append("lastName", lastName as string);
    data.append("email", email as string);
    data.append("city", city as string);
    data.append("state", state as string);
    data.append("zip", zip as string);
    data.append("logo", logo as string);
    data.append("restaurantName", restaurantName as string);
    data.append("addressLine1", addressLine1 as string);
    data.append("addressLine2", addressLine2 as string);

    try {
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const response = await axiosInstance.patch(
        `/vendors/${vendor?._id}/update-vendor-details`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update vendors
      updateVendors(response.data, setVendors);

      // Show success alert
      showSuccessAlert("Restaurant updated", setAlerts);

      // Push to dashboard
      router.push(`/admin/restaurants/${response.data.restaurant._id}`);
    } catch (err) {
      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.edit_restaurant}>
      {vendors.isLoading && <h2>Loading...</h2>}

      {!vendors.isLoading && !vendor && <h2>No vendor found</h2>}

      {vendor && (
        <>
          <h2>Edit the details</h2>
          <RestaurantForm
            file={file}
            setFile={setFile}
            isLoading={isLoading}
            buttonText="Save"
            formData={formData}
            showPasswordFields={false}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
}
