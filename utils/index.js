import axios from "axios";

// API URL
export const API_URL = "http://localhost:5100/api";

// Current year
export const currentYear = new Date().getFullYear();

// Create slug
export const createSlug = (name) => name.split(" ").join("-").toLowerCase();

// Check if any input field is empty
export const hasEmpty = (formData) =>
  Object.values(formData).some((data) => data === "");

// Check if there is an admin
export function checkAdmin(isLoading, admin, router) {
  if (!isLoading && !admin) {
    router.push("/admin");
  }
}
