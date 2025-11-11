import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { CompanyFormData, FormProps } from 'types';
import styles from './CompanyForm.module.css';
import SubmitButton from '@components/layout/SubmitButton';

interface Props extends FormProps {
  formData: CompanyFormData;
  showShiftAndCodeField: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<CompanyFormData>>;
}

export default function CompanyForm({
  isLoading,
  formData,
  setFormData,
  buttonText,
  handleSubmit,
  showShiftAndCodeField,
}: Props) {
  const {
    name,
    code,
    city,
    state,
    zip,
    shift,
    website,
    shiftBudget,
    addressLine1,
    addressLine2,
    slackChannel,
  } = formData;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const id = e.target.id;
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [id]: id === 'shiftBudget' ? +value : value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.item}>
        <label htmlFor='name'>Name</label>
        <input type='text' id='name' value={name} onChange={handleChange} />
      </div>

      {showShiftAndCodeField && (
        <div className={styles.item}>
          <select id='shift' value={shift} onChange={handleChange}>
            <option hidden>Please select a shift</option>
            <option value='DAY'>Day</option>
            <option value='NIGHT'>Night</option>
            <option value='GENERAL'>General</option>
          </select>
        </div>
      )}

      <div className={styles.item}>
        <label htmlFor='website'>Website</label>
        <input
          type='text'
          id='website'
          value={website}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='addressLine1'>Address line 1</label>
        <input
          type='text'
          id='addressLine1'
          value={addressLine1}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='addressLine2'>Address line 2</label>
        <input
          type='text'
          id='addressLine2'
          value={addressLine2}
          onChange={handleChange}
        />
      </div>

      <div className={styles.city_state_zip}>
        <div className={styles.item}>
          <label htmlFor='city'>City</label>
          <input type='text' id='city' value={city} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor='state'>State</label>
          <input type='text' id='state' value={state} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor='zip'>Zip</label>
          <input type='text' id='zip' value={zip} onChange={handleChange} />
        </div>
      </div>

      {showShiftAndCodeField && (
        <div className={styles.item}>
          <label htmlFor='code'>Code</label>
          <input type='text' id='code' value={code} onChange={handleChange} />
        </div>
      )}

      <div className={styles.item}>
        <label htmlFor='shiftBudget'>Daily budget</label>
        <input
          type='number'
          id='shiftBudget'
          value={shiftBudget}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='slackChannel'>Slack channel</label>
        <input
          type='text'
          id='slackChannel'
          value={slackChannel}
          onChange={handleChange}
        />
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
