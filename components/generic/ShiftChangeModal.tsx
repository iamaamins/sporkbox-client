import { AxiosError } from "axios";
import { IAxiosError, IShiftChangeModalProps } from "types";
import { useUser } from "@context/User";
import { useAlert } from "@context/Alert";
import { ChangeEvent, FormEvent, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";
import { axiosInstance, showErrorAlert } from "@utils/index";
import styles from "@styles/generic/ShiftChangeModal.module.css";

export default function ShiftChangeModal({
  setShowShiftChangeModal,
}: IShiftChangeModalProps) {
  // Hooks
  const { user, setUser } = useUser();
  const { setAlerts } = useAlert();
  const [isChangingShift, setIsChangingShift] = useState(false);
  const [shifts, setShifts] = useState({
    day: false,
    night: false,
  });

  // Destructure data
  const { day, night } = shifts;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setShifts((currState) => ({
      ...currState,
      [e.target.id]: e.target.checked,
    }));
  }

  // Change shift
  async function changeShift(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsChangingShift(true);

      // Format shifts
      const formattedShifts = Object.entries(shifts)
        .filter((shift) => shift[1] === true)
        .map((shift) => shift[0]);

      // Make request to the backend
      const response = await axiosInstance.patch(
        `/customers/${user?._id}/${
          user?.companies![0].code
        }/change-customer-shift`,
        { shifts: formattedShifts }
      );

      // Add the updated companies to the user
      setUser(
        (currState) => currState && { ...currState, companies: response.data }
      );

      // Close the modal
      setShowShiftChangeModal(false);
    } catch (err) {
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
      <h2>Change shift</h2>

      <form onSubmit={changeShift}>
        {user?.shifts?.map((shift, index) => (
          <div key={index}>
            <input
              id={shift}
              type="checkbox"
              onChange={handleChange}
              checked={shifts[shift as keyof object]}
            />
            <label htmlFor={shift}>{shift}</label>
          </div>
        ))}

        <SubmitButton text="Submit" isLoading={isChangingShift} />
      </form>
    </div>
  );
}
