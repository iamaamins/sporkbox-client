import Image from "next/image";

export default function ProjectScopePage() {
  return (
    <main style={mainStyle}>
      <h1 style={headerStyle}>Phase 2</h1>
      <div style={sectionStyle}>
        <h2 style={headerStyle}>New features</h2>
        <ul>
          <li>1. Ability to view modifiers with orders and items.</li>
          <li>
            2. Group of orders of identical items on the order details and
            customer page.
          </li>
          <li>
            3. Ability to see the scheduled restaurants on the company page.
          </li>
          <li>
            4. Ability to schedule restaurants on any date in the future.
            <ol style={subListStyle}>
              <li>1. Removal of automatic cart removal. </li>
              <li>
                2. The ability for the customers to order at any time in the
                future.
              </li>
            </ol>
          </li>
          <li>5. Ability to remove item image.</li>
          <li>6. Ability to see the full image of the item.</li>
          <li>
            7. 8 static dietary tags are checkable by admins during item
            creation and editing.
          </li>
          <li>8. Ability to add price for addable ingredients.</li>
          <li>
            9. Ability to see the item name separated by a comma for each date
            on the Stripe checkout page.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Bug fix</h2>
        <ul>
          <li>1. Fixing of cart items removal issue. </li>
          <li>2. Removal of the discount feature. </li>
          <li>3. Bigger restaurant name to make each restaurant obvious.</li>
          <li>
            4. Change of last name to the first name in the customer dashboard.{" "}
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Out of scope</h2>
        <ul>
          <li>
            1. Everything that is not explicitly mentioned in the project scope.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headerStyle}>Important</h2>
        <p>
          Any related or unrelated, small or big features outside of the project
          scope require additional payment and time.
        </p>
      </div>
    </main>
  );
}

const sectionStyle = { marginBottom: "2rem" };
const subListStyle = { marginLeft: "2rem" };
const headerStyle = { marginBottom: ".5rem" };
const mainStyle = { width: "80%", margin: "0 auto", padding: "2rem" };
