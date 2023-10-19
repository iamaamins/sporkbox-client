import { useUser } from '@context/User';
import { useAlert } from '@context/Alert';
import { FormEvent, useEffect, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert } from '@utils/index';
import { CustomAxiosError, ShiftChangeModalProps } from 'types';
import styles from '@styles/generic/ShiftChangeModal.module.css';

export default function ShiftChangeModal({
  setShowShiftChangeModal,
}: ShiftChangeModalProps) {
  // Hooks
  const { setAlerts } = useAlert();
  const { customer, setCustomer } = useUser();
  const [selectedShift, setSelectedShift] = useState('');
  const [isChangingShift, setIsChangingShift] = useState(false);

  useEffect(() => {
    if (customer) {
      // Find the active
      const activeCompany = customer.companies.find(
        (company) => company.status === 'ACTIVE'
      );

      // Update state
      activeCompany && setSelectedShift(activeCompany.shift);
    }
  }, [customer]);

  // Change shift
  async function changeShift(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsChangingShift(true);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/customers/${customer?._id}/${customer?.companies[0].code}/change-customer-shift`,
        { shift: selectedShift }
      );

      // Add the updated companies to the user
      setCustomer(
        (prevState) => prevState && { ...prevState, companies: response.data }
      );

      // Close the modal
      setShowShiftChangeModal(false);

      // Remove cart items and discount
      localStorage.removeItem(`discount-${customer?._id}`);
      localStorage.removeItem(`cart-${customer?._id}`);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove loader
      setIsChangingShift(false);
    }
  }

  return (
    <div className={styles.shift_change_modal}>
      <h2>Select shift</h2>

      <form onSubmit={changeShift}>
        {customer?.shifts.map((shift, index) => (
          <div key={index}>
            <input
              id={shift}
              name='shift'
              type='radio'
              checked={shift === selectedShift}
              onChange={(e) => setSelectedShift(e.target.id)}
            />
            <label htmlFor={shift} className={styles.shift}>
              {shift}
            </label>
          </div>
        ))}

        <SubmitButton text='Submit' isLoading={isChangingShift} />
      </form>
    </div>
  );
}
