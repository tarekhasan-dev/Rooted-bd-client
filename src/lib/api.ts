
import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API request helper
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

  // Attach JWT token when authentication is required
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

// Generate and inspect JWT token
export const getTestToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("JWT Token not available!");
  }

  const token = data.token;

  try {
    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      throw new Error("Invalid JWT format!");
    }

    // Decode JWT payload (does not verify signature)
    const base64 = tokenParts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedPayload = atob(
      base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "="
      )
    );

    const payload = JSON.parse(decodedPayload);

    console.log("JWT Token generated successfully!");

    console.log("JWT Payload:", {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    // Display role separately
    console.log("JWT Role:", payload.role);

    return token;
  } catch (error) {
    console.error("JWT inspection failed:", error);

    throw new Error("Failed to inspect JWT payload!");
  }
};
