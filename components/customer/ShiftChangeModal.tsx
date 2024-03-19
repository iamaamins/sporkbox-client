import { useUser } from '@context/User';
import { useAlert } from '@context/Alert';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import { CustomAxiosError } from 'types';
import styles from './ShiftChangeModal.module.css';

type Props = {
  setShowShiftChangeModal: Dispatch<SetStateAction<boolean>>;
};

export default function ShiftChangeModal({ setShowShiftChangeModal }: Props) {
  const { setAlerts } = useAlert();
  const { customer, setCustomer } = useUser();
  const [selectedShift, setSelectedShift] = useState('');
  const [isChangingShift, setIsChangingShift] = useState(false);

  async function changeShift(e: FormEvent) {
    e.preventDefault();

    try {
      setIsChangingShift(true);
      const response = await axiosInstance.patch(
        `/customers/${customer?._id}/${customer?.companies[0].code}/change-customer-shift`,
        { shift: selectedShift }
      );
      setCustomer(
        (prevState) => prevState && { ...prevState, companies: response.data }
      );

      setShowShiftChangeModal(false);
      localStorage.removeItem(`discount-${customer?._id}`);
      localStorage.removeItem(`cart-${customer?._id}`);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsChangingShift(false);
    }
  }

  useEffect(() => {
    if (customer) {
      const activeCompany = customer.companies.find(
        (company) => company.status === 'ACTIVE'
      );
      activeCompany && setSelectedShift(activeCompany.shift);
    }
  }, [customer]);

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
