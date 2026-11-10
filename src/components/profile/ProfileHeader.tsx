
"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  Camera,
  Mail,
  MapPin,
  Pencil,
  UserRound,
  LoaderCircle,
} from "lucide-react";

import type { UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
  user?: UserProfile | null;
  onEdit?: () => void;
  onImageUpload?: (file: File) => Promise<void>;
  isUploadingImage?: boolean;
  onValidationError?: (message: string) => void;
}

export default function ProfileHeader({
  user,
  onEdit,
  onImageUpload,
  isUploadingImage = false,
  onValidationError,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safe fallback
  const profile = user ?? {
    id: "",
    name: "",
    email: "",
    image: null,
    role: "",
    location: {},
  };

  const initials = profile.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const roleLabel = profile.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : null;

  // Handle Profile Image Selection
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      onValidationError?.(
        "Only JPG, PNG and WEBP images are allowed!"
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onValidationError?.(
        "Image size must be less than 5 MB!"
      );

      event.target.value = "";
      return;
    }

    try {
      await onImageUpload?.(file);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#e1ece5] bg-white shadow-sm">

      {/* Cover Section */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-r from-[#164223] via-[#267a44] to-[#78945c] sm:h-48">

        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10" />

        <div className="absolute -right-2 -top-10 h-48 w-48 rounded-full border border-white/10" />

        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="absolute bottom-5 left-6 text-white/80 sm:left-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em]">
            rooted.BD
          </p>

          <p className="mt-1 text-sm text-white/70">
            Growing together, creating change.
          </p>
        </div>

      </div>

      {/* Profile Information */}
      <div className="px-5 pb-6 sm:px-10">

        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

            {/* Profile Picture */}
            <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#edf2e5] shadow-md">

                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={`${profile.name || "User"}'s profile picture`}
                    fill
                    sizes="112px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#267a44]">
                    {initials || <UserRound size={36} />}
                  </span>
                )}

              </div>

              {/* Upload Profile Picture */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                aria-label="Change profile picture"
                title="Change profile picture"
                className="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#267a44] text-white shadow-md transition hover:bg-[#164223] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingImage ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Camera size={17} />
                )}
              </button>

              {/* Image File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="*/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>

            {/* User Details */}
            <div className="pb-1">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-bold tracking-tight text-[#18352b] sm:text-3xl">
                  {profile.name || "Your Profile"}
                </h1>

                {roleLabel && (
                  <span className="rounded-full bg-[#edf2e5] px-3 py-1 text-xs font-semibold text-[#267a44]">
                    {roleLabel}
                  </span>
                )}

              </div>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Mail size={15} />
                <span className="break-all">
                  {profile.email}
                </span>
              </p>

              {profile.location?.district && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={15} />
                  {profile.location.district}
                  {profile.location.division &&
                    `, ${profile.location.division}`}
                </p>
              )}

            </div>

          </div>

          {/* Edit Profile Button */}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1e5631] px-5 text-sm font-semibold text-white transition hover:bg-[#164223] focus:outline-none focus:ring-2 focus:ring-[#267a44] focus:ring-offset-2"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}

        </div>
      </div>
    </section>
  );
}
