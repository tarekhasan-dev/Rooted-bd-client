
"use client";

import { useEffect } from "react";

type ThemeMode = "light" | "dark" | "system";

function readTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem("rooted-theme");

    return saved === "dark" || saved === "light" || saved === "system"
      ? saved
      : "system";
  } catch {
    return "system";
  }
}

export default function ThemeInit() {
  useEffect(() => {
    const root = document.documentElement;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // Apply Theme
    const applyTheme = () => {
      const theme = readTheme();

      const resolved: "light" | "dark" =
        theme === "system"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : theme;

      // Update data-theme
      root.dataset.theme = resolved;

      // Update Tailwind Dark Mode
      root.classList.toggle("dark", resolved === "dark");
    };

    // Initial Theme
    applyTheme();

    // System Theme Change
    const handleSystemChange = () => {
      if (readTheme() === "system") {
        applyTheme();
      }
    };

    // Local Storage Change
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "rooted-theme") {
        applyTheme();
      }
    };

    // Sync Tailwind when another component changes data-theme
    const observer = new MutationObserver(() => {
      const currentTheme = root.dataset.theme;

      if (currentTheme === "dark" || currentTheme === "light") {
        root.classList.toggle("dark", currentTheme === "dark");
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    mediaQuery.addEventListener("change", handleSystemChange);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);

      window.removeEventListener("storage", handleStorageChange);

      observer.disconnect();
    };
  }, []);

  return null;
}
