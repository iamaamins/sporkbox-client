import { useState } from 'react';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import { showErrorAlert } from '@utils/index';
import LinkButton from '@components/layout/LinkButton';
import styles from '@styles/admin/DiscountCodes.module.css';

export default function DiscountCodes() {
  // Hooks
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const { discountCodes, setDiscountCodes } = useData();

  // Handle delete discount code
  async function handleDelete() {
    try {
      // Make request to the backend
      // Update state
      // setDiscountCodes(prevState => prevState.data.filter(discountCode => discountCode.id !== request.data._id))
    } catch (err) {
      // Log err
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  return (
    <section className={styles.discount_codes}>
      {discountCodes.isLoading && <h2>Loading...</h2>}

      {!discountCodes.isLoading && discountCodes.data.length === 0 && (
        <h2>No discount codes</h2>
      )}

      {discountCodes.data.length > 0 && (
        <>
          <h2>Discount codes</h2>

          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Value</th>
                <th>Redeemability</th>
                <th className={styles.hide_on_mobile}>Total redeem</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {discountCodes.data.map((discountCode) => (
                <tr key={discountCode._id}>
                  <td>{discountCode.code}</td>
                  <td>{discountCode.value}</td>
                  <td className={styles.redeemability}>
                    {discountCode.redeemability}
                  </td>
                  <td className={styles.hide_on_mobile}>
                    {discountCode.totalRedeem}
                  </td>
                  <td onClick={handleDelete}>
                    <span>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <LinkButton
        linkText='Add discount code'
        href='/admin/discount-codes/add-discount-code'
      />
    </section>
  );
}
