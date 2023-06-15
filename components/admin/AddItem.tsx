import ItemForm from "./ItemForm";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { FormEvent, useEffect, useState } from "react";
import { IAxiosError, IItemFormData } from "types";
import {
  axiosInstance,
  showErrorAlert,
  updateVendors,
  showSuccessAlert,
} from "@utils/index";
import { AxiosError } from "axios";
import styles from "@styles/admin/AddItem.module.css";

export default function AddItem() {
  // Initial states
  const initialState = {
    name: "",
    price: "",
    file: undefined,
    updatedTags: [],
    description: "",
    optionalAddons: {
      addons: "",
      addable: 0,
    },
    requiredAddons: {
      addons: "",
      addable: 0,
    },
    removableIngredients: "",
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setVendors, vendors } = useData();
  const [index, setIndex] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IItemFormData>(initialState);

  // Destructure form data
  const {
    file,
    name,
    price,
    updatedTags,
    description,
    optionalAddons,
    requiredAddons,
    removableIngredients,
  } = formData;

  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the vendor
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );

      if (vendor) {
        // Update state
        setIndex(vendor.restaurant.items.length.toString());
      }
    }
  }, [vendors, router.isReady]);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Create tags string
    const tags = updatedTags.join(", ");

    // Append the data
    data.append("name", name as string);
    data.append("tags", tags as string);
    data.append("price", price as string);
    data.append("index", index as string);
    file && data.append("file", file as File);
    data.append("description", description as string);
    data.append("optionalAddons", JSON.stringify(optionalAddons));
    data.append("requiredAddons", JSON.stringify(requiredAddons));
    data.append("removableIngredients", removableIngredients as string);

    // Add a new item
    try {
      // Show loader
      setIsLoading(true);

      // Post the data to backend
      const response = await axiosInstance.post(
        `/restaurants/${router.query.restaurant}/add-item`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update vendors with updated items
      updateVendors(response.data, setVendors);

      // Reset form data
      setFormData(initialState);

      // Show success alert
      showSuccessAlert("Item added", setAlerts);

      // Back to the restaurant page
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_item}>
      <h2>Add an item</h2>

      <ItemForm
        buttonText="Save"
        formData={formData}
        isLoading={isLoading}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
