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
export function updateRestaurants(res, update, setRestaurants) {
  // Updated restaurant
  const updatedRestaurant = res.data;

  // Update the restaurants state
  setRestaurants((prevRestaurants) =>
    prevRestaurants.map((prevRestaurant) => {
      if (prevRestaurant._id === updatedRestaurant._id) {
        return {
          ...prevRestaurant,
          [update]: updatedRestaurant[update],
        };
      } else {
        return prevRestaurant;
      }
    })
  );
}

// Get scheduled restaurants
export function getScheduledRestaurants(restaurants, setScheduledRestaurants) {
  if (restaurants) {
    setScheduledRestaurants(
      restaurants
        .filter((restaurant) => restaurant.status === "APPROVED")
        .filter(
          (approvedRestaurant) =>
            new Date(approvedRestaurant.scheduledOn).getTime() >
            new Date().getTime()
        )
    );
  }
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
