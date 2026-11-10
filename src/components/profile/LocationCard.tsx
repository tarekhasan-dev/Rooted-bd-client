"use client";

import { MapPin, Pencil, MapPinned } from "lucide-react";

import type { UserProfile } from "@/types/profile";

interface LocationCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

export default function LocationCard({
  user,
  onEdit,
}: LocationCardProps) {
  const locationFields = [
    {
      label: "Division",
      value: user.location?.division,
    },
    {
      label: "District",
      value: user.location?.district,
    },
    {
      label: "Upazila",
      value: user.location?.upazila,
    },
    {
      label: "Postal Code",
      value: user.location?.postalCode,
    },
  ];

  return (
    <section className="rounded-3xl border border-[#e1ece5] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2e5] text-[#267a44]">
            <MapPinned size={20} />
          </span>

          <div>
            <h2 className="text-lg font-bold text-[#18352b]">
              Location
            </h2>

            <p className="text-xs text-gray-500">
              Your address information
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e1ece5] px-3 py-2 text-sm font-semibold text-[#267a44] transition hover:bg-[#f4f8f5]"
          >
            <Pencil size={15} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {locationFields.map(({ label, value }) => (
          <div key={label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {label}
            </p>

            <div className="flex items-center gap-3">
              <MapPin
                size={17}
                className="shrink-0 text-[#78945c]"
              />

              <p className="text-sm font-medium text-[#18352b]">
                {value || "Not provided"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}