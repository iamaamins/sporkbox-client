import LinkButton from '@components/layout/LinkButton';
import { useData } from '@context/Data';
import styles from '@styles/admin/DiscountCodes.module.css';

export default function DiscountCodes() {
  // Hooks
  const { discountCodes } = useData();

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
                <tr>
                  <td>{discountCode.code}</td>
                  <td>{discountCode.value}</td>
                  <td>{discountCode.redeemability}</td>
                  <td className={styles.hide_on_mobile}>
                    {discountCode.totalRedeem}
                  </td>
                  <td>Delete</td>
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
