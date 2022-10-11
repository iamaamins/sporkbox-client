// Current year
export const currentYear = new Date().getFullYear();

// Convert number
export const convertNumber = (number) => +number.toLocaleString("en-US");

// Convert date to slug
export const convertDateToTime = (date) => new Date(date).getTime();

// Convert iso date to locale date string
export const convertDate = (str) =>
  new Date(str).toDateString().split(" ").slice(0, 3).join(" ");

// Check if any input field is empty
export const hasEmpty = (formData) =>
  Object.values(formData).some((data) => data === "");

// Check if there is an admin
export function checkUser(isLoading, user, router) {
  if (!isLoading && !user) {
    router.push("/login");
  }
}

// Update restaurants items
export function updateVendors(res, setVendors) {
  // Updated restaurant
  const updatedData = res.data;

  // Update the restaurants state
  setVendors((prevVendors) =>
    prevVendors.map((prevVendor) => {
      if (prevVendor._id === updatedData._id) {
        return {
          ...prevVendor,
          status: updatedData.status,
        };
      } else if (prevVendor.restaurant._id === updatedData._id) {
        return {
          ...prevVendor,
          restaurant: updatedData,
        };
      } else {
        return prevVendor;
      }
    })
  );
}

// Group items by property
export function groupBy(key, items, itemsName) {
  // Crate groups with provided key
  const groupsObj = items.reduce((acc, curr) => {
    // Property to create group with
    const property = curr[key];

    // If property exists in acc then,
    // add the current item to the property array
    if (property in acc) {
      return { ...acc, [property]: [...acc[property], curr] };
    }

    // Else create a property and
    // add the current item to an array
    return { ...acc, [property]: [curr] };
  }, {});

  // Convert the object
  const groupsArr = Object.keys(groupsObj).map((property) => ({
    [key]: property,
    [itemsName]: groupsObj[property],
  }));

  return groupsArr;
}
