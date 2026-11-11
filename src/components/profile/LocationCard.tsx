"use client";

import { MapPin, MapPinned } from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import CardShell, { InfoField } from "@/components/profile/CardShell";

import type { UserProfile } from "@/types/profile";

interface LocationCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

export default function LocationCard({ user, onEdit }: LocationCardProps) {
  const { t } = useLang();

  const locationFields = [
    { label: t("pr_division"), value: user.location?.division },
    { label: t("pr_district"), value: user.location?.district },
    { label: t("pr_upazila"), value: user.location?.upazila },
    { label: t("pr_postal_code"), value: user.location?.postalCode },
  ];

  return (
    <CardShell
      icon={MapPinned}
      title={t("pr_location_title")}
      subtitle={t("pr_location_subtitle")}
      onEdit={onEdit}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {locationFields.map(({ label, value }) => (
          <InfoField
            key={label}
            label={label}
            value={
              <span className="capitalize">
                {value || t("pr_not_provided")}
              </span>
            }
            icon={MapPin}
          />
        ))}
      </div>
    </CardShell>
  );
}