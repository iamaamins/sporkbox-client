import ItemForm from './ItemForm';
import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import styles from './EditItem.module.css';
import { FormEvent, useEffect, useState } from 'react';
import { Item, CustomAxiosError, ItemFormData } from 'types';
import {
  splitTags,
  axiosInstance,
  showErrorAlert,
  updateVendors,
  showSuccessAlert,
} from '@lib/utils';

export default function EditItem() {
  const initialState = {
    name: '',
    price: 0,
    image: '',
    tags: [],
    file: undefined,
    description: '',
    optionalAddons: {
      addons: '',
      addable: 0,
    },
    requiredAddons: {
      addons: '',
      addable: 0,
    },
    removableIngredients: '',
  };

  const router = useRouter();
  const { dietaryTags } = useData();
  const { setAlerts } = useAlert();
  const { vendors, setVendors } = useData();
  const [item, setItem] = useState<Item>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ItemFormData>(initialState);

  const {
    file,
    name,
    price,
    image,
    tags,
    description,
    optionalAddons,
    requiredAddons,
    removableIngredients,
  } = formData;

  // Get the item
  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      const item = vendors.data
        .find((vendor) => vendor.restaurant._id === router.query.restaurant)
        ?.restaurant.items.find((item) => item._id === router.query.item);

      if (item) {
        setItem(item);
        setFormData({
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          optionalAddons: item.optionalAddons,
          requiredAddons: item.requiredAddons,
          removableIngredients: item.removableIngredients,
          tags: splitTags(item.tags).filter((currTag) =>
            dietaryTags.data.includes(currTag)
          ),
        });
      }
    }
  }, [vendors, router.isReady]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = new FormData();

    data.append('name', name);
    file && data.append('file', file);
    data.append('tags', tags.join(', '));
    data.append('price', price as string);
    image && data.append('image', image);
    data.append('description', description);
    data.append('optionalAddons', JSON.stringify(optionalAddons));
    data.append('requiredAddons', JSON.stringify(requiredAddons));
    data.append('removableIngredients', removableIngredients as string);

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/restaurants/${router.query.restaurant}/${router.query.item}/update-item-details`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      updateVendors(response.data, setVendors);
      showSuccessAlert('Item updated', setAlerts);
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
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
