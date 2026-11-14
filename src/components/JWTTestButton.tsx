
"use client";

import { useState } from "react";
import { getTestToken } from "@/lib/api";

export default function JWTTestButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTestJWT = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = await getTestToken();

      if (!token) {
        throw new Error("JWT Token was not generated!");
      }

      // Copy JWT Token to clipboard
      await navigator.clipboard.writeText(token);

      setMessage("JWT Token generated and copied successfully!");

      console.log("JWT Token generated successfully!");
      console.log("Token length:", token.length);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong!";

      setMessage(errorMessage);
      console.error("JWT Test Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">
        JWT Authentication Test
      </h2>

      <p className="text-sm text-gray-500">
        Generate a JWT token and copy it to your clipboard.
      </p>

      <button
        type="button"
        onClick={handleTestJWT}
        disabled={loading}
        className="rounded-lg bg-green-600 px-5 py-2.5 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating Token..." : "Generate & Copy JWT"}
      </button>

      {message && (
        <p className="text-sm font-medium" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
