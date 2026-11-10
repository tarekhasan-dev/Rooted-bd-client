"use client";

import type { UserProfile } from "@/types/profile";
import { Heart, Pencil } from "lucide-react";

interface InterestsCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

export default function InterestsCard({
  user,
  onEdit,
}: InterestsCardProps) {
  return (
    <div className="rounded-2xl border border-[#e1ece5] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#edf2e5] p-3 text-[#267A44]">
            <Heart size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#164223]">
              Interests & Causes
            </h2>

            <p className="text-sm text-gray-500">
              Your interests and social causes
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-[#267A44] transition hover:bg-[#edf2e5]"
            aria-label="Edit interests"
          >
            <Pencil size={18} />
          </button>
        )}
      </div>

      {/* Interests */}
      {user.interests && user.interests.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest, index) => (
            <span
              key={`${interest}-${index}`}
              className="rounded-full border border-[#e1ece5] bg-[#edf2e5] px-4 py-2 text-sm font-medium text-[#267A44]"
            >
              {interest}
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-[#fafcfb] px-4 py-8 text-center">
          <Heart
            size={28}
            className="mx-auto mb-2 text-gray-300"
          />

          <p className="text-sm text-gray-500">
            No interests added yet.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add your interests and causes to complete your profile.
          </p>
        </div>
      )}
    </div>
  );
}