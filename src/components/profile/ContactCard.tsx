"use client";

import { Mail, Pencil, Phone, ContactRound } from "lucide-react";

import type { UserProfile } from "@/types/profile";

interface ContactCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

export default function ContactCard({
  user,
  onEdit,
}: ContactCardProps) {
  return (
    <section className="rounded-3xl border border-[#e1ece5] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2e5] text-[#267a44]">
            <ContactRound size={20} />
          </span>

          <div>
            <h2 className="text-lg font-bold text-[#18352b]">
              Contact Information
            </h2>
            <p className="text-xs text-gray-500">
              How people can reach you
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

      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44]">
            <Mail size={18} />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Email Address
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#18352b]">
              {user.email || "Not provided"}
            </p>

            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#edf2e5] px-2.5 py-1 text-[11px] font-semibold text-[#267a44]">
              {user.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44]">
            <Phone size={18} />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Phone Number
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#18352b]">
              {user.phone || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}