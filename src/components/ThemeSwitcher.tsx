"use client";

import { Laptop, Moon, Sun, type LucideIcon } from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import type { TKey } from "@/lib/i18n";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeSwitcherProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const THEMES: { value: ThemeMode; label: TKey; Icon: LucideIcon }[] = [
  { value: "light", label: "theme_light", Icon: Sun },
  { value: "dark", label: "theme_dark", Icon: Moon },
  { value: "system", label: "theme_system", Icon: Laptop },
];

export default function ThemeSwitcher({
  theme,
  onThemeChange,
}: ThemeSwitcherProps) {
  const { t } = useLang();

  return (
    <div className="rpd-seg" role="group" aria-label={t("dd_appearance")}>
      {THEMES.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={theme === value ? "is-active" : ""}
          aria-pressed={theme === value}
          onClick={() => onThemeChange(value)}
        >
          <Icon size={14} />
          <span>{t(label)}</span>
        </button>
      ))}
    </div>
  );
}