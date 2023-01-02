import ItemForm from "./ItemForm";
import { IFormData } from "types";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { FormEvent, useState } from "react";
import styles from "@styles/admin/AddItem.module.css";
import { axiosInstance, updateVendors } from "@utils/index";

export default function AddItem() {
  // Initial states
  const initialState = {
    name: "",
    tags: "",
    price: 0,
    description: "",
  };

  // Hooks
  const router = useRouter();
  const { setVendors } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Destructure form data
  const { name, tags, price, description } = formData;

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Append the data
    data.append("image", image as File);
    data.append("name", name as string);
    data.append("tags", tags as string);
    data.append("price", price as string);
    data.append("description", description as string);

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

      // Back to the restaurant page
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_item}>
      <h2>Add an item</h2>

      <ItemForm
        formData={formData}
        image={image}
        setFormData={setFormData}
        buttonText="Save"
        isLoading={isLoading}
        setImage={setImage}
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
