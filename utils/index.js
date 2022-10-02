// API URL
export const API_URL = "http://localhost:5100/api";

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
