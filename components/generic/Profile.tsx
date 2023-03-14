import { useUser } from "@context/User";
import { formatCurrencyToUSD } from "@utils/index";
import styles from "@styles/generic/Profile.module.css";
import { useState } from "react";
import ModalContainer from "@components/layout/ModalContainer";
import ShiftChangeModal from "./ShiftChangeModal";

export default function Profile() {
  const { user } = useUser();
  const [showShiftChangeModal, setShowShiftChangeModal] = useState(false);

  return (
    <section className={styles.profile}>
      {user && (
        <div className={styles.details}>
          <h2>Welcome {user.firstName}</h2>
          <p>
            Daily budget:{" "}
            <span>{formatCurrencyToUSD(user.company?.dailyBudget!)}</span>
          </p>
          <p>
            Company: <span>{user.company?.name}</span>
          </p>
          <p>
            Shift: <span>{user.company?.shift}</span>
          </p>
          <p>
            Address:{" "}
            <span>
              {user.company?.address.addressLine2 ? (
                <>
                  {user.company?.address.addressLine1},{" "}
                  {user.company?.address.addressLine2},{" "}
                  {user.company?.address.city}, {user.company?.address.state}{" "}
                  {user.company?.address.zip}
                </>
              ) : (
                <>
                  {user.company?.address.addressLine1},{" "}
                  {user.company?.address.city}, {user.company?.address.state}{" "}
                  {user.company?.address.zip}
                </>
              )}
            </span>
          </p>

          <button onClick={() => setShowShiftChangeModal(true)}>
            Change shift
          </button>
        </div>
      )}

      <ModalContainer
        component={<ShiftChangeModal />}
        showModalContainer={showShiftChangeModal}
        setShowModalContainer={setShowShiftChangeModal}
      />
    </section>
  );
}
