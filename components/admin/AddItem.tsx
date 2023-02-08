import ItemForm from "./ItemForm";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { useAlert } from "@context/Alert";
import { FormEvent, useState } from "react";
import { IAxiosError, IDietaryTags, IFormData } from "types";
import {
  axiosInstance,
  showErrorAlert,
  showSuccessAlert,
  updateVendors,
} from "@utils/index";
import { AxiosError } from "axios";
import styles from "@styles/admin/AddItem.module.css";

export default function AddItem() {
  // Initial states
  const initialState = {
    name: "",
    tags: "",
    price: 0,
    description: "",
    addableIngredients: "",
    removableIngredients: "",
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const { name, price, description, addableIngredients, removableIngredients } =
    formData;

  // Handle submit
  async function handleSubmit(
    e: FormEvent,
    dietaryTags: IDietaryTags,
    file: File | undefined
  ) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Create tags string
    const tags = Object.entries(dietaryTags)
      .filter((dietaryTag) => dietaryTag[1] === true)
      .map((dietaryTag) => dietaryTag[0])
      .join(", ");

    // Append the data
    data.append("file", file as File);
    data.append("name", name as string);
    data.append("tags", tags as string);
    data.append("price", price as string);
    data.append("description", description as string);
    data.append("addableIngredients", addableIngredients as string);
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
