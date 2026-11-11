
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Update browser document language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Change language and save it in a cookie
  const setLang = useCallback((l: Lang) => {
    setLangState(l);

    try {
      document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Language still changes for the current session
    }
  }, []);

  const t = useCallback(
    (key: TKey) => dict[lang][key],
    [lang]
  );

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
        t,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
