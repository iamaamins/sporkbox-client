import axios from "axios";

// API URL
export const API_URL = "http://localhost:5100/api";

// Current year
export const currentYear = new Date().getFullYear();

// Create slug
export const createSlug = (name) => name.split(" ").join("-").toLowerCase();

// Check if there is an admin
export function checkAdmin(isLoading, admin, router) {
  if (!isLoading && !admin) {
    router.push("/admin");
  }
}

// Check if any input field is empty
export const hasEmpty = (formData) =>
  Object.values(formData).some((data) => data === "");

// Fetch user from DB
export async function getUser(userType, setUser, setIsLoading) {
  try {
    // Fetch the data
    const res = await axios.get(`${API_URL}/${userType}/me`, {
      withCredentials: true,
    });

    // Update state
    setUser(res.data);

    // Remove the loader
    setIsLoading(false);
  } catch (err) {
    console.log(err.response.data.message);

    // Remove the loader
    setIsLoading(false);
  }
}
