export const API_URL = "http://localhost:5100/api";

export const currentYear = new Date().getFullYear();

export const createSlug = (name) => name.split(" ").join("-").toLowerCase();

export function checkAdmin(loading, admin, router) {
  if (!loading && !admin) {
    router.push("/admin");
  }
}
