"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dict, type Lang, type TKey } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
};

const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (key) => dict.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // সেভ করা ভাষা ফিরিয়ে আনা
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "bn" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // <html lang="..."> আপডেট
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }, []);

  const t = useCallback((key: TKey) => dict[lang][key], [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);