// API URL
// http://localhost:5100/api
// https://sporkbytes.onrender.com/api
export const API_URL = "https://sporkbytes.onrender.com/api";

// Current year
export const currentYear = new Date().getFullYear();

// Create slug
export const createSlug = (name) =>
  name.split("'").join("").split(" ").join("-").toLowerCase();

// Convert iso date to locale date string
export const convertDate = (str) => new Date(str).toLocaleDateString();

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
