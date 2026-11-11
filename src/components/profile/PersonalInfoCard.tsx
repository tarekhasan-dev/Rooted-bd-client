"use client";

import { useState } from "react";
import { CalendarDays, UserRound } from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import CardShell, { InfoField } from "@/components/profile/CardShell";

import type { UserProfile } from "@/types/profile";

interface PersonalInfoCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

const BIO_LIMIT = 220;

export default function PersonalInfoCard({
  user,
  onEdit,
}: PersonalInfoCardProps) {
  const { t, lang } = useLang();
  const [expanded, setExpanded] = useState(false);

  const isBangla = lang === "bn";

  // Format Date According to Selected Language
  const formatDate = (date?: string) => {
    if (!date) return t("pr_not_provided");

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return t("pr_not_provided");
    }

    return parsedDate.toLocaleDateString(isBangla ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const bio = user.bio?.trim() ?? "";
  const isLongBio = bio.length > BIO_LIMIT;
  const visibleBio =
    isLongBio && !expanded ? `${bio.slice(0, BIO_LIMIT).trimEnd()}…` : bio;

  return (
    <CardShell
      icon={UserRound}
      title={t("pr_personal_title")}
      subtitle={t("pr_personal_subtitle")}
      onEdit={onEdit}
    >
      {/* Personal Information Fields */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InfoField
          label={t("pr_full_name")}
          value={user.name || t("pr_not_provided")}
          icon={UserRound}
        />

        <InfoField
          label={t("pr_date_of_birth")}
          value={formatDate(user.dateOfBirth)}
          icon={CalendarDays}
        />

        <InfoField
          label={t("pr_gender")}
          value={
            <span className="capitalize">
              {user.gender || t("pr_not_provided")}
            </span>
          }
          icon={UserRound}
        />
      </div>

      {/* About Me */}
      <div className="mt-7 border-t border-[#e1ece5] pt-5 dark:border-gray-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t("pr_about_me")}
        </p>

        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-600 dark:text-gray-300">
          {visibleBio || t("pr_no_bio")}
        </p>

        {isLongBio && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="mt-2 text-xs font-semibold text-[#267a44] hover:underline dark:text-[#75d69a]"
          >
            {expanded
              ? isBangla
                ? "কম দেখুন"
                : "Show less"
              : isBangla
                ? "আরও দেখুন"
                : "Read more"}
          </button>
        )}
      </div>
    </CardShell>
  );
}