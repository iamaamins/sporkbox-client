export default function ProjectScopePage() {
  return (
    <main style={{ width: "80%", margin: "0 auto", padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>
          Admin Dashboard - Built with React - 2 weeks timeline{" "}
        </h2>
        <h3 style={{ marginBottom: ".5rem" }}>Admin:</h3>
        <ul>
          <li>1. can add and remove a restaurant.</li>
          <li>2. can add and remove meals for a restaurant. </li>
          <li>3. can add and remove a company. </li>
          <li>
            4. can select the restaurants for each weekday to show on the front
            end.
          </li>
          <li>5. can see all active orders.</li>
          <li>
            6. can mark an order as completed once it’s delivered and the
            employee will receive a notification either via slack or email.
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>
          Frontend - Built with React - 2 weeks timeline
        </h2>
        <h3 style={{ marginBottom: ".5rem" }}>The website:</h3>
        <ul>
          <li>1. will have a homepage.</li>
          <li>2. will have login and registration pages for employees.</li>
          <li>
            3. will have a week page where available meals will be shown for
            each day for the upcoming week.
          </li>
          <li>
            4. will have a customizable basket/cart to save the selected meals
            by an employee.
          </li>
          <li>
            5. will have a checkout page (no payment gateway integration) for an
            employee to order meals.
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>
          Employee Dashboard - Built with React - 2 weeks timeline
        </h2>
        <h3 style={{ marginBottom: ".5rem" }}>Employee:</h3>
        <ul>
          <li>1. can log in and see the current and previous orders. </li>
          <li>2. can add a meal to their favorite list. </li>
          <li>3. can leave a review on a meal</li>
        </ul>
      </div>

      <h2 style={{ marginBottom: "2rem" }}>
        Backend and APIs - Built with NodeJs - 2 weeks timeline
      </h2>

      <div style={{ marginBottom: "2rem" }}>
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
      </p>
    </main>
  );
}
