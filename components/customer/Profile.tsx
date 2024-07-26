import { useState } from 'react';
import { useUser } from '@context/User';
import ShiftChangeModal from './ShiftChangeModal';
import {
  axiosInstance,
  numberToUSD,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import styles from './Profile.module.css';
import LinkButton from '@components/layout/LinkButton';
import ModalContainer from '@components/layout/ModalContainer';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import ButtonLoader from '@components/layout/ButtonLoader';

export default function Profile() {
  const { customer, setCustomer } = useUser();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [showShiftChangeModal, setShowShiftChangeModal] = useState(false);

  const isSubscribed =
    customer && Object.values(customer.subscribedTo).includes(true);

  async function handleEmailSubscriptions() {
    if (!customer) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/customers/${customer._id}/update-email-subscriptions`,
        {
          isSubscribed,
        }
      );
      setCustomer(
        (prevState) =>
          prevState && {
            ...prevState,
            subscribedTo: response.data.subscribedTo,
          }
      );
      showSuccessAlert('Subscriptions updated', setAlerts);
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  const company = customer?.companies.find((el) => el.status === 'ACTIVE');

  return (
    <section className={styles.profile}>
      {customer && (
        <div className={styles.details}>
          <h2>Welcome {customer.firstName}</h2>
          {company && (
            <p>
              Company: <span>{company.name}</span>
            </p>
          )}
          {company && (
            <div>
              <p className={styles.shift}>
                Shift: <span>{company.shift}</span>
              </p>
              <p>
                Budget: <span>{numberToUSD(company.shiftBudget)}</span>
              </p>
              <p>
                Address:{' '}
                <span>
                  {company.address.addressLine2 ? (
                    <>
                      {company.address.addressLine1},{' '}
                      {company.address.addressLine2}, {company.address.city},{' '}
                      {company.address.state} {company.address.zip}
                    </>
                  ) : (
                    <>
                      {company.address.addressLine1}, {company.address.city},{' '}
                      {company.address.state} {company.address.zip}
                    </>
                  )}
                </span>
              </p>
            </div>
          )}
          <div className={styles.buttons}>
            {customer.shifts.length > 0 && (
              <button onClick={() => setShowShiftChangeModal(true)}>
                Select shift
              </button>
            )}
            <button onClick={handleEmailSubscriptions}>
              {isLoading ? (
                <ButtonLoader />
              ) : isSubscribed ? (
                'Opt-out emails'
              ) : (
                'Opt-in emails'
              )}
            </button>
          </div>
        </div>
      )}
      <div>
        <div className={styles.order_timeline}>
          <p className={styles.title}>Order timeline</p>
          <div className={styles.timeline_items}>
            <p>
              <strong>Tuesday</strong> 12pm - Ordering opens up for the
              following week.
            </p>
            <p>
              <strong>Friday</strong> 12pm - Ordering closes for next week
              Monday-Wednesday.
            </p>
            <p>
              <strong>Monday</strong> 12pm - Ordering closes for that week
              Thursday-Sunday.
            </p>
          </div>
        </div>
        <div className={styles.instructions}>
          <p className={styles.title}>Getting started with Spork Box</p>
          <div className={styles.instruction}>
            <p>
              <strong>Step 1</strong>: Choose a shift
            </p>
            <ul>
              <li>
                Click the &apos;Select shift&apos; button and select the shift
                you currently work on.
              </li>
              <li>
                The details of your shift will display above the &apos;Select
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
                You&apos;ll see all of the upcoming dates that are ready for
                ordering.
              </li>
              <li>
                Your daily budget is how much your company will cover for you
                each day. Any daily total over that amount, you&apos;ll need to
                cover at check out.
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
                you&apos;ll need to check out fo the remainder with a credit
                card.
              </li>
              <li>
                Once you&apos;ve checkout out, your &apos;Dashboard&apos; tab on
                the menu will show all of your upcoming and delivered orders.
              </li>
              <li>
                If you need to modify an order, contact{' '}
                <a href='mailto: portland@sporkbytes.com'>
                  portland@sporkbytes.com
                </a>{' '}
                as soon as possible.
              </li>
            </ul>
          </div>
          <a
            target='_blank'
            rel='noreferrer'
            className={styles.video_link}
            href='https://www.loom.com/share/f2074c4c42ba4e95a524485716ea5fe0'
          >
            Watch a video on how Spork Box works here!{' '}
          </a>
          <LinkButton
            target='_blank'
            linkText='Leave feedback'
            href='https://docs.google.com/forms/d/e/1FAIpQLScEX27Y29aUk3af86VlHxUKTRFj9L00GSclzDn5wTqJUwnylw/viewform?usp=sf_link'
          />
        </div>
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
