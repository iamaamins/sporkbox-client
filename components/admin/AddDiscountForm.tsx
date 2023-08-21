import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '@styles/admin/AddDiscountForm.module.css';
import SubmitButton from '@components/layout/SubmitButton';

export default function AddDiscountForm() {
  const initialState = {
    code: '',
    value: '',
    redeemability: 'unlimited',
  };
  // Hooks
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

    console.log(formData);
  }

  return (
    <section className={styles.add_discount_form}>
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
            checked={redeemability === '1'}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                redeemability: e.target.checked ? '1' : 'unlimited',
              }))
            }
          />
        </div>

        <SubmitButton text='Submit' isLoading={isLoading} />
      </form>
    </section>
  );
}
