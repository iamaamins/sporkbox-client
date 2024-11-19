import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import { useData } from '@context/Data';
import LinkButton from '@components/layout/LinkButton';
import { axiosInstance, showErrorAlert } from '@lib/utils';
import styles from './DiscountCodes.module.css';

export default function DiscountCodes() {
  // Hooks
  const { setAlerts } = useAlert();
  const { discountCodes, setDiscountCodes } = useData();

  // Handle delete discount code
  async function handleDelete(id: string) {
    try {
      // Make request to the backend
      const response = await axiosInstance.delete(
        `/discount-code/delete/${id}`
      );

      // Update state
      setDiscountCodes((prevState) => ({
        ...prevState,
        data: prevState.data.filter(
          (discountCode) => discountCode._id !== response.data
        ),
      }));
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
                  <td onClick={() => handleDelete(discountCode._id)}>
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
