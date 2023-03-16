import { useState } from "react";
import { useUser } from "@context/User";
import ShiftChangeModal from "./ShiftChangeModal";
import { formatCurrencyToUSD } from "@utils/index";
import styles from "@styles/generic/Profile.module.css";
import ModalContainer from "@components/layout/ModalContainer";

export default function Profile() {
  // Hooks
  const { user } = useUser();
  const [showShiftChangeModal, setShowShiftChangeModal] = useState(false);

  return (
    <section className={styles.profile}>
      {user && user.companies && (
        <div className={styles.details}>
          <h2>Welcome {user.firstName}</h2>
          <p>
            Company: <span>{user.companies[0].name}</span>
          </p>

          {user.companies.map((company, index) => (
            <div key={index}>
              <p>
                Shift: <span>{company.shift}</span>
              </p>
              <p>
                Budget: <span>{formatCurrencyToUSD(company.shiftBudget!)}</span>
              </p>
              <p>
                Address:{" "}
                <span>
                  {company.address.addressLine2 ? (
                    <>
                      {company.address.addressLine1},{" "}
                      {company.address.addressLine2}, {company.address.city},{" "}
                      {company.address.state} {company.address.zip}
                    </>
                  ) : (
                    <>
                      {company.address.addressLine1}, {company.address.city},{" "}
                      {company.address.state} {company.address.zip}
                    </>
                  )}
                </span>
              </p>
            </div>
          ))}

          <button onClick={() => setShowShiftChangeModal(true)}>
            Change shift
          </button>
        </div>
      )}

      <ModalContainer
        showModalContainer={showShiftChangeModal}
        setShowModalContainer={setShowShiftChangeModal}
        component={
          <ShiftChangeModal setShowShiftChangeModal={setShowShiftChangeModal} />
        }
      />
    </section>
  );
}
