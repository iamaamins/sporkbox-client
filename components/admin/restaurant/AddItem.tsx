import ItemForm from './ItemForm';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import { FormEvent, useEffect, useState } from 'react';
import { CustomAxiosError, ItemFormData } from 'types';
import {
  axiosInstance,
  showErrorAlert,
  updateVendors,
  showSuccessAlert,
} from '@lib/utils';
import styles from './AddItem.module.css';

export default function AddItem() {
  const initialState = {
    name: '',
    price: '',
    tags: [],
    file: undefined,
    description: '',
    optionalAddons: {
      addons: '',
      addable: 0,
    },
    requiredAddonsOne: {
      addons: '',
      addable: 0,
    },
    requiredAddonsTwo: {
      addons: '',
      addable: 0,
    },
    removableIngredients: '',
  };

  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setVendors, vendors } = useData();
  const [index, setIndex] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ItemFormData>(initialState);

  const {
    file,
    name,
    price,
    tags,
    description,
    optionalAddons,
    requiredAddonsOne,
    requiredAddonsTwo,
    removableIngredients,
  } = formData;

  useEffect(() => {
    if (vendors.data.length > 0 && router.isReady) {
      const vendor = vendors.data.find(
        (vendor) => vendor.restaurant._id === router.query.restaurant
      );
      if (vendor) setIndex(vendor.restaurant.items.length.toString());
    }
  }, [vendors, router.isReady]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = new FormData();

    data.append('name', name);
    data.append('tags', tags.join(', '));
    file && data.append('file', file);
    data.append('price', price as string);
    data.append('index', index as string);
    data.append('description', description);
    data.append('optionalAddons', JSON.stringify(optionalAddons));
    data.append('requiredAddonsOne', JSON.stringify(requiredAddonsOne));
    data.append('requiredAddonsTwo', JSON.stringify(requiredAddonsTwo));
    data.append('removableIngredients', removableIngredients as string);

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/restaurants/${router.query.restaurant}/add-item`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      updateVendors(response.data, setVendors);
      setFormData(initialState);

      showSuccessAlert('Item added', setAlerts);
      router.push(`/admin/restaurants/${router.query.restaurant}`);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_item}>
      <h2>Add an item</h2>
      <ItemForm
        buttonText='Save'
        formData={formData}
        isLoading={isLoading}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
