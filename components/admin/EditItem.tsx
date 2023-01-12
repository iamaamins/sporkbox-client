import ItemForm from "./ItemForm";
import { IFormData, IItem } from "types";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import styles from "@styles/admin/EditItem.module.css";
import { axiosInstance, updateVendors } from "@utils/index";
import React, { FormEvent, useEffect, useState } from "react";

export default function EditItem() {
  // Initial state
  const initialState = {
    name: "",
    tags: "",
    price: 0,
    description: "",
    addableItems: "",
    removableItems: "",
  };

  // Hooks
  const router = useRouter();
  const { vendors, setVendors } = useData();
  const [item, setItem] = useState<IItem>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const {
    name,
    tags,
    price,
    image,
    description,
    addableItems,
    removableItems,
  } = formData;

  // Get the item
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the item
      const item = vendors.data
        .find((vendor) => vendor.restaurant._id === router.query.restaurant)
        ?.restaurant.items.find((item) => item._id === router.query.item);

      if (item) {
        // Items details
        const itemDetails = {
          name: item.name,
          tags: item.tags,
          price: item.price,
          image: item.image,
          description: item.description,
        };

        // Update states
        setItem(item);
        setFormData((currState) =>
          item.addableItems && item.removableItems
            ? {
                ...itemDetails,
                addableItems: item.addableItems,
                removableItems: item.removableItems,
              }
            : item.addableItems
            ? {
                ...currState,
                ...itemDetails,
                addableItems: item.addableItems,
              }
            : item.removableItems
            ? {
                ...itemDetails,
                removableItems: item.removableItems,
              }
            : { ...currState, ...itemDetails }
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
    data.append("name", name as string);
    data.append("tags", tags as string);
    data.append("price", price as string);
    data.append("image", image as string);
    data.append("description", description as string);
    data.append("addableItems", addableItems as string);
    data.append("removableItems", removableItems as string);

    // Add a new item
    try {
      // Show loader
      setIsLoading(true);

      // Post the data to backend
      const response = await axiosInstance.patch(
        `/restaurants/${router.query.restaurant}/${router.query.item}/update-item-details`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update vendors with updated items
      updateVendors(response.data, setVendors);

      // Back to the restaurant page
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      // Log error
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.edit_item}>
      {vendors.isLoading && <h2>Loading...</h2>}

      {!vendors.isLoading && !item && <h2>No item found</h2>}

      {item && (
        <>
          <h2>Edit the details</h2>

          <ItemForm
            formData={formData}
            file={file}
            setFile={setFile}
            setFormData={setFormData}
            buttonText="Save"
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
}
