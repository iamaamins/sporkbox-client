import { AxiosError } from "axios";
import { IAxiosError, ICustomer, IShiftChangeModalProps } from "types";
import { useUser } from "@context/User";
import { useAlert } from "@context/Alert";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";
import { axiosInstance, showErrorAlert } from "@utils/index";
import styles from "@styles/generic/ShiftChangeModal.module.css";

export default function ShiftChangeModal({
  setShowShiftChangeModal,
}: IShiftChangeModalProps) {
  // Hooks
  const { setAlerts } = useAlert();
  const { customer, setCustomer } = useUser();
  const [selectedShift, setSelectedShift] = useState("");
  const [isChangingShift, setIsChangingShift] = useState(false);

  useEffect(() => {
    if (customer) {
      // Find the active
      const activeCompany = customer.companies.find(
        (company) => company.status === "ACTIVE"
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
        (currState) => currState && { ...currState, companies: response.data }
      );

      // Close the modal
      setShowShiftChangeModal(false);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
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
              name="shift"
              type="radio"
              checked={shift === selectedShift}
              onChange={(e) => setSelectedShift(e.target.id)}
            />
            <label htmlFor={shift} className={styles.shift}>
              {shift}
            </label>
          </div>
        ))}

        <SubmitButton text="Submit" isLoading={isChangingShift} />
      </form>
    </div>
  );
}
