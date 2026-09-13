const API_BASE_URL = "http://localhost:8000/api";

export default async function apiFetch(path: string, options?: RequestInit) {
  return await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
  });
}
