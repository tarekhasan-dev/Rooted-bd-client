"use client";

import { getTestToken } from "@/lib/api";

export default function TestTokenButton() {
  const handleGetToken = async () => {
    try {
      const token = await getTestToken();

      await navigator.clipboard.writeText(token);

      alert("JWT Token copied successfully!");
    } catch (error) {
      console.error("Token Error:", error);
      alert("Unable to generate JWT Token!");
    }
  };

  return (
    <button
      onClick={handleGetToken}
      className="rounded-lg bg-green-700 px-5 py-3 text-white"
    >
      Get JWT Token
    </button>
  );
}