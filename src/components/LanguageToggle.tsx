"use client";

import { useLang } from "@/components/LanguageProvider";

export default function LanguageToggle({
  inline = false,
}: {
  inline?: boolean;
}) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`lang-toggle${inline ? " lang-toggle-inline" : ""}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={lang === "bn" ? "active" : ""}
        aria-pressed={lang === "bn"}
        onClick={() => setLang("bn")}
      >
        বাংলা
      </button>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}