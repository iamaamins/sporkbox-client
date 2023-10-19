import ItemForm from './ItemForm';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import styles from '@styles/admin/EditItem.module.css';
import { FormEvent, useEffect, useState } from 'react';
import { Item, CustomAxiosError, ItemFormData } from 'types';
import {
  tags,
  splitTags,
  axiosInstance,
  showErrorAlert,
  updateVendors,
  showSuccessAlert,
} from '@utils/index';

export default function EditItem() {
  // Initial state
  const initialState = {
    name: '',
    price: 0,
    image: '',
    currentTags: '',
    file: undefined,
    updatedTags: [],
    description: '',
    optionalAddons: [],
    requiredAddons: [],
    removableIngredients: '',
  };

  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { vendors, setVendors } = useData();
  const [item, setItem] = useState<Item>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ItemFormData>(initialState);

  // Destructure form data
  const {
    file,
    name,
    price,
    image,
    updatedTags,
    description,
    optionalAddons,
    requiredAddons,
    removableIngredients,
  } = formData;

  // Get the item
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      // Find the item
      const item = vendors.data
        .find((vendor) => vendor.restaurant._id === router.query.restaurant)
        ?.restaurant.items.find((item) => item._id === router.query.item);

      if (item) {
        // Update states
        setItem(item);
        setFormData({
          name: item.name,
          price: item.price,
          image: item.image,
          currentTags: item.tags,
          description: item.description,
          optionalAddons: item.optionalAddons,
          requiredAddons:
            item.requiredAddons.length === 2
              ? item.requiredAddons
              : [...item.requiredAddons, { addons: '', addable: 0 }],
          removableIngredients: item.removableIngredients,
          updatedTags: splitTags(item.tags).filter((currTag) =>
            tags.includes(currTag)
          ),
        });
      }
    }
  }, [vendors, router.isReady]);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create FormData instance
    const data = new FormData();

    // Create tags string
    const tags = updatedTags.join(', ');

    // Append the data
    data.append('name', name as string);
    data.append('tags', tags as string);
    data.append('price', price as string);
    file && data.append('file', file as File);
    image && data.append('image', image as string);
    data.append('description', description as string);
    data.append('optionalAddons', JSON.stringify(optionalAddons));
    data.append('requiredAddons', JSON.stringify(requiredAddons));
    data.append('removableIngredients', removableIngredients as string);

    // Add a new item
    try {
      // Show loader
      setIsLoading(true);

      // Post the data to backend
      const response = await axiosInstance.patch(
        `/restaurants/${router.query.restaurant}/${router.query.item}/update-item-details`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Update vendors with updated items
      updateVendors(response.data, setVendors);

      // Show success alert
      showSuccessAlert('Item updated', setAlerts);

      // Back to the restaurant page
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
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
            buttonText='Save'
            formData={formData}
            isLoading={isLoading}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
}
