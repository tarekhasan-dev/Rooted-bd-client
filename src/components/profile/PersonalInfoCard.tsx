"use client";

import { CalendarDays, Pencil, UserRound } from "lucide-react";

import type { UserProfile } from "@/types/profile";

interface PersonalInfoCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

export default function PersonalInfoCard({
  user,
  onEdit,
}: PersonalInfoCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fields = [
    {
      label: "Full Name",
      value: user.name || "Not provided",
      icon: UserRound,
    },
    {
      label: "Date of Birth",
      value: formatDate(user.dateOfBirth),
      icon: CalendarDays,
    },
    {
      label: "Gender",
      value: user.gender || "Not provided",
      icon: UserRound,
    },
  ];

  return (
    <section className="rounded-3xl border border-[#e1ece5] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2e5] text-[#267a44]">
              <UserRound size={20} />
            </span>

            <div>
              <h2 className="text-lg font-bold text-[#18352b]">
                Personal Information
              </h2>
              <p className="text-xs text-gray-500">
                Your personal details
              </p>
            </div>
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
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {label}
            </p>

            <div className="flex items-center gap-3">
              <Icon size={17} className="shrink-0 text-[#78945c]" />

              <p className="break-words text-sm font-medium text-[#18352b]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 border-t border-[#e1ece5] pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          About Me
        </p>

        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
          {user.bio?.trim() || "No bio added yet."}
        </p>
      </div>
    </section>
  );
}