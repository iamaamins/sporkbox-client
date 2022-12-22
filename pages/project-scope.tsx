import Image from "next/image";

export default function ProjectScopePage() {
  return (
    <main style={mainStyle}>
      <h1 style={headerStyle}>Sprint II</h1>
      <div style={sectionStyle}>
        <h2 style={headerStyle}>Admin Dashboard</h2>
        <ul>
          <li>
            1. Shows Upcoming Orders grouped by Company and Delivery date.
          </li>
          <li>
            2. “Orders Details Page” for each group by clicking on the delivery
            date.
          </li>
          <li>
            3. Button to export a group of orders with the following fields as
            CSV.
            <ol style={subListStyle}>
              <li>1. Delivery date</li>
              <li>2. First name</li>
              <li> 3. Last name</li>
              <li> 4. Email</li>
              <li> 5. Restaurant name</li>
              <li> 6. Item name</li>
              <li> 7. Dietary tags</li>
              <li> 8. Description</li>
              <li> 9. Total price</li>
            </ol>
          </li>
          <li>4. Ability to sort groups of orders by date and company.</li>
          <li>
            5. Shows Scheduled Restaurants with the date and the company they
            are scheduled for.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>The orders details page</h2>
        <ul>
          <li>
            1. Orders details section with a row for each restaurant with
            delivery date, company, restaurant name, and the number of orders
            with a button to email all the customers once orders are delivered.
          </li>
          <li>
            2. Orders summary section for each restaurant with a row for each
            order with dish name, total price, and quantity and a row at the
            bottom with the total price and total quantity.
          </li>
          <li>
            3. Customer information section for each restaurant with a row for
            each customer with name, email, and name of the dish they ordered.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Other admin features</h2>
        <ul>
          <li>
            1. Ability to edit company, customer, restaurant, and item details.
          </li>
          <li>
            2. Ability to archive and unarchive company, customer, restaurant,
            item, and order.
            <ol style={subListStyle}>
              <li>1. Confirm archive action with a popup.</li>
              <li>
                2. When an order is archived, it will be removed both from the
                customer and admin dashboard. The customer will be notified by
                email and can reorder for that date.
              </li>
            </ol>
          </li>

          <li>3. Change &apos;Item tags&apos; to &apos;Dietary tags&apos;.</li>
          <li>
            4. Ability to remove and deactivate a scheduled restaurant from a
            date.
            <ol style={subListStyle}>
              <li>
                1. When removed, upcoming orders related to that restaurant will
                be archived.
              </li>
              <li>
                2. When deactivated, upcoming orders related to that restaurant
                won&apos;t be archived.
              </li>
            </ol>
          </li>
          <li>
            5. Ability to upload and change the item image.
            <ol style={subListStyle}>
              <li>
                1. Restaurant logo will be shown as the item image if the item
                doesn&apos;t have a dedicated image.
              </li>
            </ol>
          </li>
          <li>
            6. Ability to see registered customers on the related company page
            (sorted alphabetically by last name, two sections for active and
            archived customers, and the ability to change status) with:
            <ol style={subListStyle}>
              <li>1. First name</li>
              <li>2. Last name</li>
              <li>3. Email address</li>
              <li>4. Joined date</li>
            </ol>
          </li>
          <li>
            7. Separate page for each customer with:
            <ol style={subListStyle}>
              <li>1. Name, and company address.</li>
              <li> 2. All upcoming orders.</li>
              <li> 3. All delivered orders. </li>
            </ol>
          </li>

          <li>
            8. Ability to create new admins from the admin side with:
            <ol style={subListStyle}>
              <li>1. First name</li>
              <li>2. Last name</li>
              <li>3. Email address</li>
              <li>4. Password</li>
            </ol>
          </li>

          <li>9. Ability to reset the password by email.</li>
          <li>10. Change the “Orders” tab to “Delivered”.</li>
          <li>
            11. Ability to upload a logo for a restaurant during creation.
          </li>
          <li>12. Ability to schedule restaurants from the company page.</li>
          <li>13. Stripe payment method integration.</li>
          <li>14. Ability to add addable and removable item ingredients.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Client features</h2>
        <ul>
          <li>
            1. Shows portland@sporkbytes.com & 503-821-7709 on the contact page.
          </li>
          <li>
            2. Ordering close and automatic cart items removal functionality at
            3 pm Friday.
          </li>
          <li>
            3. Change &apos;Active order&apos; to &apos;Upcoming orders&apos; on
            the dashboard
          </li>
          <li>4. Shows scheduled restaurants with no date restrictions.</li>
          <li>5. Shows delivery date on the individual item page.</li>
          <li>6. Shows price next to the item name on the item page.</li>
          <li>7. Shows the total price on the order summary (item) page.</li>
          <li>
            8. Contact support button opens the mail app with
            portland@sporkbytes.com.
          </li>
          <li>
            9. Ability to add and remove ingredients of an item in an order.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>General features</h2>
        <ul>
          <li>1. Show alert for error, success, and over budget.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Bug fix</h2>
        <ul>
          <li>
            1. Can not check out an item that has been discounted down to the
            budget allowance.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Admin dashboard</h2>
        <Image
          src="/project-scope/admin-dashboard.png"
          height="100%"
          width="100%"
          layout="responsive"
        />
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Orders details page</h2>
        <Image
          src="/project-scope/orders-details.png"
          height="100%"
          width="100%"
          layout="responsive"
        />
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Company page</h2>
        <Image
          src="/project-scope/company.png"
          height="100%"
          width="100%"
          layout="responsive"
        />
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Customer details page</h2>
        <Image
          src="/project-scope/customer-details.png"
          height="100%"
          width="100%"
          layout="responsive"
        />
      </div>

      {/* <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>Payment milestones:</h2>
        <ul>
          <li>
            1. The first milestone/payment is to be made at the beginning of the
            project - Done.
          </li>
          <li>
            2. The second milestone/payment is to be made when admin UI is built
            - Done
          </li>
          <li>
            3. Third milestone/payment to be made when the admin UI is connected
            with the backend - Processing.
          </li>
          <li>
            4. Fourth milestone/payment to be made when the customer-facing UI
            is built.
          </li>
          <li>
            5. Fifth milestone/payment to be made when the customer-facing UI is
            connected to the backend.
          </li>
          <li>
            6. Sixth milestone/payment to be made when the employee dashboard is
            built.
          </li>
        </ul>
      </div>

      <p>
        Project completion and final milestone approval when the employee
        dashboard is connected with the backend.
      </p> */}
    </main>
  );
}

const sectionStyle = { marginBottom: "2rem" };
const subListStyle = { marginLeft: "2rem" };
const headerStyle = { marginBottom: ".5rem" };
const mainStyle = { width: "80%", margin: "0 auto", padding: "2rem" };
