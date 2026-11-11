"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useLang } from "@/components/LanguageProvider";

interface CardShellProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
  children: ReactNode;
}

export default function CardShell({
  icon: Icon,
  title,
  subtitle,
  onEdit,
  editLabel,
  className = "",
  children,
}: CardShellProps) {
  const { t } = useLang();

  return (
    <section
      className={`h-full rounded-2xl border border-[#e1ece5] bg-white p-4 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 sm:p-5 ${className}`}
    >
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf2e5] text-[#267a44] dark:bg-[#1d3829] dark:text-[#75d69a]">
            <Icon size={18} />
          </span>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-[#18352b] dark:text-gray-100">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={editLabel || t("pr_edit")}
            title={editLabel || t("pr_edit")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e1ece5] px-2.5 py-1.5 text-xs font-semibold text-[#267a44] transition hover:bg-[#f4f8f5] dark:border-gray-700 dark:text-[#75d69a] dark:hover:bg-gray-800"
          >
            <Pencil size={13} />
            <span className="hidden sm:inline">{t("pr_edit")}</span>
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}

export function InfoField({ label, value, icon: Icon }: InfoFieldProps) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </p>

      <div className="flex items-center gap-2">
        <Icon size={15} className="shrink-0 text-[#78945c]" />

        <p className="break-words text-[13px] font-medium text-[#18352b] dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}