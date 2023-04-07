import { useState } from "react";
import { useUser } from "@context/User";
import ShiftChangeModal from "./ShiftChangeModal";
import { formatCurrencyToUSD } from "@utils/index";
import styles from "@styles/generic/Profile.module.css";
import ModalContainer from "@components/layout/ModalContainer";
import LinkButton from "@components/layout/LinkButton";

export default function Profile() {
  // Hooks
  const { customer } = useUser();
  const [showShiftChangeModal, setShowShiftChangeModal] = useState(false);

  return (
    <section className={styles.profile}>
      {customer && (
        <div className={styles.details}>
          <h2>Welcome {customer.firstName}</h2>
          <p>
            Company: <span>{customer.companies[0].name}</span>
          </p>

          {customer.companies
            .filter((company) => company.status === "ACTIVE")
            .map((company, index) => (
              <div key={index}>
                <p className={styles.shift}>
                  Shift: <span>{company.shift}</span>
                </p>
                <p>
                  Budget:{" "}
                  <span>{formatCurrencyToUSD(company.shiftBudget)}</span>
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

          {customer.shifts.length > 0 && (
            <button onClick={() => setShowShiftChangeModal(true)}>
              Select shift
            </button>
          )}
        </div>
      )}

      <div className={styles.instructions}>
        <p className={styles.title}>Getting started with Spork Box</p>

        <div className={styles.instruction}>
          <p>
            <strong>Step 1</strong>: Choose a shift
          </p>
          <ul>
            <li>
              Click the &apos;Select shift&apos; button and select the shift you
              currently work on.
            </li>
            <li>
              The details of your shift will display above the &apos;Change
              shift&apos; button.
            </li>
          </ul>
        </div>

        <div className={styles.instruction}>
          <p>
            <strong>Step 2</strong>: Place your lunch orders
          </p>
          <ul>
            <li>
              Click the &apos;Place order&apos; tab on the menu bar above.
            </li>
            <li>
              You&apos;ll see all of the upcoming days that have scheduled
              restaurants for ordering.
            </li>
            <li>
              Your daily budget is how much your company will cover for you each
              day. Any daily total over that amount, you&apos;ll need to cover
              at check out.
            </li>
            <li>Prices includes all fees and gratuity.</li>
          </ul>
        </div>

        <div className={styles.instruction}>
          <p>
            <strong>Step 3</strong>: Check out
          </p>
          <ul>
            <li>
              Make all of your selections for the week or time frame that
              you&apos;ll be at the office.
            </li>
            <li>
              Once you&apos;ve made all of your selections, click on the bag
              logo at the top right to see your cart.
            </li>
            <li>
              If the cart looks good, click &apos;Check out&apos;. If any days
              you&apos;ve order for exceed your company&apos;s budget,
              you&apos;ll need to check out fo the remainder with a credit card.
            </li>
            <li>
              Once you&apos;ve checkout out, your &apos;Dashboard&apos; tab on
              the menu will show all of your upcoming and delivered orders.
            </li>
            <li>
              If you need to modify an order, contact{" "}
              <a href="mailto: portland@sporkbytes.com">
                portland@sporkbytes.com
              </a>{" "}
              as soon as possible.
            </li>
          </ul>
        </div>

        <a href="/" target="_blank" className={styles.video_link}>
          Watch a video on how Spork Box works here!{" "}
        </a>

        <LinkButton linkText="Leave feedback" href="/leave-feedback" />
      </div>

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
