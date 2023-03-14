import { AxiosError } from "axios";
import { IAxiosError } from "types";
import { useAlert } from "@context/Alert";
import { ChangeEvent, FormEvent, useState } from "react";
import SubmitButton from "@components/layout/SubmitButton";
import { axiosInstance, showErrorAlert } from "@utils/index";
import styles from "@styles/generic/ShiftChangeModal.module.css";

export default function ShiftChangeModal() {
  // Hooks
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

      // Make request to the backend
      const response = await axiosInstance.post("/user/change-shift");
    } catch (err) {
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
        <div>
          <input
            id="day"
            type="checkbox"
            checked={day}
            onChange={handleChange}
          />
          <label htmlFor="day">Day</label>
        </div>
        <div>
          <input
            id="night"
            type="checkbox"
            checked={night}
            onChange={handleChange}
          />
          <label htmlFor="night">Night</label>
        </div>
      </form>

      <SubmitButton text="Submit" isLoading={isChangingShift} />
    </div>
  );
}
