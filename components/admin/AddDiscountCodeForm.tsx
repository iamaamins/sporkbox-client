import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert } from '@utils/index';
import styles from '@styles/admin/AddDiscountCodeForm.module.css';

export default function AddDiscountCodeForm() {
  const initialState = {
    code: '',
    value: '',
    redeemability: 'unlimited',
  };
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { setDiscountCodes } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Destructure data
  const { code, value, redeemability } = formData;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Make request to the backend
      const response = await axiosInstance.post('/discount-code/add', {
        code,
        value,
        redeemability,
      });

      // Update state
      setDiscountCodes((prevState) => ({
        ...prevState,
        data: [...prevState.data, response.data],
      }));

      // Push to discount codes page
      router.push('/admin/discount-codes');
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
    <section className={styles.add_discount_code_form}>
      <h2>Add discount code</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='code'>Code</label>
          <input type='text' id='code' value={code} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor='value'>Value</label>
          <input type='text' id='value' value={value} onChange={handleChange} />
        </div>

        <div className={styles.redeemability}>
          <label htmlFor='redeemability'>Redeemable once</label>
          <input
            type='checkbox'
            id='redeemability'
            checked={redeemability === 'once'}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                redeemability: e.target.checked ? 'once' : 'unlimited',
              }))
            }
          />
        </div>

        <SubmitButton text='Submit' isLoading={isLoading} />
      </form>
    </section>
  );
}
