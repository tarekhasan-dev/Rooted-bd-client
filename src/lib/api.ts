import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
) => {
  if (!API_URL) {
    throw new Error("API URL is not configured!");
  }

  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication required. Please login first.");
    }

    headers.set("Authorization", `Bearer ${data.token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API request failed!");
  }

  return result;
};