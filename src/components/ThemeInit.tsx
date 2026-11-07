"use client";

import { useEffect } from "react";

// Restores the saved light/dark theme after the page loads
export default function ThemeInit() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rooted-theme");
      if (saved === "dark" || saved === "light") {
        document.documentElement.dataset.theme = saved;
      }
    } catch {
      // localStorage may be blocked; keep the default theme
    }
  }, []);

  return null;
}