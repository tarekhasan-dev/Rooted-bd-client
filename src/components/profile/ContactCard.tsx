"use client";

import { Mail, Phone, ContactRound } from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import CardShell from "@/components/profile/CardShell";

import type { UserProfile } from "@/types/profile";

interface ContactCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

export default function ContactCard({ user, onEdit }: ContactCardProps) {
  const { t } = useLang();

  return (
    <CardShell
      icon={ContactRound}
      title={t("pr_contact_title")}
      subtitle={t("pr_contact_subtitle")}
      onEdit={onEdit}
    >
      <div className="space-y-5">
        {/* Email Address */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44] dark:bg-gray-800 dark:text-[#75d69a]">
            <Mail size={18} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {t("pr_email_address")}
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#18352b] dark:text-gray-100">
              {user.email || t("pr_not_provided")}
            </p>

            <span
              className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                user.emailVerified
                  ? "bg-[#edf2e5] text-[#267a44] dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}
            >
              {user.emailVerified ? t("pr_verified") : t("pr_not_verified")}
            </span>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44] dark:bg-gray-800 dark:text-[#75d69a]">
            <Phone size={18} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {t("pr_phone_number")}
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#18352b] dark:text-gray-100">
              {user.phone || t("pr_not_provided")}
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  );
}