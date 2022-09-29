import axios from "axios";

// API URL
export const API_URL = "http://localhost:5100/api";

// Current year
export const currentYear = new Date().getFullYear();

// Create slug
export const createSlug = (name) => name.split(" ").join("-").toLowerCase();

// Check if there is an admin
export function checkAdmin(loading, admin, router) {
  if (!loading && !admin) {
    router.push("/admin");
  }
}

// Check if any input field is empty
export const hasEmpty = (formData) =>
  Object.values(formData).some((data) => data === "");

// Fetch user from DB
export function getUser(router, userType, setUser, setLoading) {
  if (router.isReady) {
    async function getUser() {
      try {
        // Fetch the data
        const res = await axios.get(`${API_URL}/${userType}/me`, {
          withCredentials: true,
        });

        // Update state
        setUser(res.data);

        // Remove the loader
        setLoading(false);
      } catch (err) {
        console.log(err);

        // Remove the loader
        setLoading(false);
      }
    }

    // Call the function
    getUser();
  }
}
