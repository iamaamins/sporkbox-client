import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { FormProps, GuestFormData } from 'types';
import styles from './CompanyForm.module.css';
import SubmitButton from '@components/layout/SubmitButton';

interface Props extends FormProps {
  formData: GuestFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<GuestFormData>>;
}

export default function GuestForm({
  isLoading,
  formData,
  setFormData,
  buttonText,
  handleSubmit,
}: Props) {
  const { firstName, lastName, email } = formData;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.item}>
        <label htmlFor='firstName'>First name*</label>
        <input
          type='text'
          id='firstName'
          required
          value={firstName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='lastName'>Last name*</label>
        <input
          type='text'
          id='lastName'
          required
          value={lastName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='email'>Email*</label>
        <input
          type='email'
          required
          id='email'
          value={email}
          onChange={handleChange}
        />
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
