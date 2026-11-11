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

import { useLang } from "@/components/LanguageProvider";
import type { UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
  user?: UserProfile | null;
  onEdit?: () => void;
  onImageUpload?: (file: File) => Promise<void>;
  isUploadingImage?: boolean;
  onValidationError?: (message: string) => void;
}

const TREES = [
  { x: 100, y: 260, r: 43 },
  { x: 330, y: 265, r: 32 },
  { x: 490, y: 260, r: 48 },
  { x: 810, y: 260, r: 40 },
  { x: 1030, y: 260, r: 50 },
  { x: 1160, y: 265, r: 35 },
];

export default function ProfileHeader({
  user,
  onEdit,
  onImageUpload,
  isUploadingImage = false,
  onValidationError,
}: ProfileHeaderProps) {
  const { t, lang } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBangla = lang === "bn";

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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      onValidationError?.(t("mp_image_type_error"));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onValidationError?.(t("mp_image_size_error"));
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
    <section className="overflow-hidden rounded-2xl border border-[#e1ece5] bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Banner Animations */}
      <style>{`
        @keyframes phSunGlow {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes phCloudDriftA {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(45px); }
        }

        @keyframes phCloudDriftB {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-55px); }
        }

        @keyframes phTreeSway {
          0%, 100% { transform: rotate(-1.6deg); }
          50% { transform: rotate(1.6deg); }
        }

        @keyframes phLeafFall {
          0% {
            transform: translate(0, -10px) rotate(0deg);
            opacity: 0;
          }
          15% { opacity: 1; }
          50% {
            transform: translate(-18px, 45px) rotate(130deg);
          }
          85% { opacity: 1; }
          100% {
            transform: translate(14px, 95px) rotate(260deg);
            opacity: 0;
          }
        }

        .ph-sun {
          transform-origin: 680px 30px;
          animation: phSunGlow 6s ease-in-out infinite;
        }

        .ph-cloud-a {
          animation: phCloudDriftA 18s ease-in-out infinite;
        }

        .ph-cloud-b {
          animation: phCloudDriftB 22s ease-in-out infinite;
        }

        .ph-tree {
          animation: phTreeSway 5s ease-in-out infinite;
        }

        .ph-leaf {
          transform-box: fill-box;
          transform-origin: center;
          animation: phLeafFall 9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ph-sun,
          .ph-cloud-a,
          .ph-cloud-b,
          .ph-tree,
          .ph-leaf {
            animation: none;
          }
        }
      `}</style>

      {/* Banner */}
      <div className="relative h-[150px] overflow-hidden bg-gradient-to-b from-[#e5f5dd] via-[#c2e8b8] to-[#99d690] sm:h-[180px] md:h-[200px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 320"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="profileSunGlow">
              <stop offset="0%" stopColor="#fff6a5" />
              <stop offset="60%" stopColor="#ffd84d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffd000" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="profileHillBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b6e5ab" />
              <stop offset="100%" stopColor="#90ce84" />
            </linearGradient>

            <linearGradient id="profileHillFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9dd691" />
              <stop offset="100%" stopColor="#72b564" />
            </linearGradient>
          </defs>

          {/* Sun */}
          <g className="ph-sun">
            <circle cx="680" cy="30" r="115" fill="url(#profileSunGlow)" />
          </g>

          {/* Clouds */}
          <g fill="white" opacity="0.8">
            <path
              className="ph-cloud-a"
              d="M150 75 Q170 45 205 55 Q240 35 265 65 Q300 60 310 85 L150 90Z"
            />
            <path
              className="ph-cloud-b"
              d="M850 95 Q875 65 905 75 Q940 55 970 85 Q1000 80 1015 105 L850 110Z"
            />
          </g>

          {/* Hills */}
          <path
            d="M-50 220 Q200 160 450 210 Q700 260 950 180 Q1150 130 1300 190 L1300 350 L-50 350Z"
            fill="url(#profileHillBack)"
          />
          <path
            d="M-50 250 Q150 210 380 240 Q650 270 900 210 Q1100 170 1280 230 L1280 350 L-50 350Z"
            fill="url(#profileHillFront)"
          />

          {/* Trees (sway from the base) */}
          {TREES.map((tree, index) => (
            <g
              key={index}
              className="ph-tree"
              style={{
                transformOrigin: `${tree.x}px ${tree.y + 10}px`,
                animationDelay: `${index * 450}ms`,
                animationDuration: `${4.5 + (index % 3) * 0.8}s`,
              }}
            >
              <rect
                x={tree.x - 7}
                y={tree.y - 100}
                width="14"
                height="110"
                rx="4"
                fill="#7a4a2a"
              />
              <circle cx={tree.x} cy={tree.y - 125} r={tree.r} fill="#37864f" />
              <circle
                cx={tree.x - 25}
                cy={tree.y - 100}
                r={tree.r * 0.72}
                fill="#469b60"
              />
              <circle
                cx={tree.x + 25}
                cy={tree.y - 100}
                r={tree.r * 0.72}
                fill="#4da468"
              />
            </g>
          ))}

          {/* Falling Leaves */}
          <g fill="#368d4e">
            <path
              className="ph-leaf"
              style={{ animationDelay: "0s", animationDuration: "9s" }}
              d="M285 75 Q295 65 305 75 Q295 85 285 75Z"
            />
            <path
              className="ph-leaf"
              style={{ animationDelay: "2.5s", animationDuration: "11s" }}
              d="M460 60 Q472 50 480 65 Q465 75 460 60Z"
            />
            <path
              className="ph-leaf"
              style={{ animationDelay: "1.2s", animationDuration: "10s" }}
              d="M945 80 Q955 70 962 82 Q950 92 945 80Z"
            />
            <path
              className="ph-leaf"
              style={{ animationDelay: "4s", animationDuration: "12s" }}
              d="M1005 70 Q1018 60 1025 72 Q1012 85 1005 70Z"
            />
          </g>

          {/* People Planting a Tree */}
          <g transform="translate(585 145)">
            <g transform="translate(-15 0)">
              <circle cx="0" cy="0" r="18" fill="#d99b73" />
              <path
                d="M-18 25 Q-25 50 -25 95 L25 95 Q25 50 18 25Z"
                fill="#d95338"
              />
              <path
                d="M12 40 Q35 50 55 42"
                stroke="#d99b73"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            <g transform="translate(68 42)">
              <circle cx="0" cy="0" r="11" fill="#c4835b" />
              <path d="M-12 14 L12 14 L16 52 L-16 52Z" fill="white" />
              <path d="M-22 -2 Q0 -18 22 -2Z" fill="#e0a96d" />
              <ellipse cx="0" cy="-2" rx="28" ry="6" fill="#c98d50" />
            </g>
          </g>
        </svg>

        {/* Readability Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/25 to-transparent" />

        {/* Brand */}
        <div className="absolute left-5 top-3 flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1 text-xs font-bold tracking-widest text-[#164223] shadow-sm backdrop-blur-md sm:left-6">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 motion-reduce:animate-none" />
          ROOTED.BD
        </div>

        {/* Heading */}
        <div className="absolute left-5 top-[52px] z-10 max-w-[260px] sm:left-6 sm:top-[60px] sm:max-w-md">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#267a44]">
            {isBangla ? "আপনার ব্যক্তিগত জায়গা" : "YOUR PERSONAL SPACE"}
          </p>

          <h1 className="text-xl font-extrabold tracking-tight text-[#164223] sm:text-2xl md:text-3xl">
            {isBangla ? "আমার প্রোফাইল" : "My Profile"}
          </h1>

          <p className="mt-1 hidden text-xs font-medium leading-relaxed text-[#315d3c] sm:block sm:text-sm">
            {isBangla
              ? "আপনার ব্যক্তিগত তথ্য ও অ্যাকাউন্টের বিবরণ পরিচালনা করুন।"
              : "Manage your personal information and account details."}
          </p>
        </div>

        {/* Brand Decoration */}
        <div className="absolute bottom-3 right-5 hidden rounded-full border border-white/40 bg-white/30 px-3 py-1.5 text-[11px] font-semibold text-[#27613a] backdrop-blur-md sm:block">
          Growing Together · Creating Change
        </div>
      </div>

      {/* Profile Information Bar */}
      <div className="flex flex-col items-center gap-4 px-5 pb-4 sm:flex-row sm:items-start sm:px-6">
        {/* Profile Picture */}
        <div className="relative -mt-10 h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#edf2e5] shadow-lg dark:border-gray-900 dark:bg-gray-800">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={t("ph_user_alt")}
                fill
                sizes="96px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#267a44]">
                {initials || <UserRound size={30} />}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            aria-label={t("ph_change_picture")}
            title={t("ph_change_picture")}
            className="absolute -bottom-1.5 -right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#267a44] text-white shadow-md transition hover:scale-110 hover:bg-[#164223] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-900"
          >
            {isUploadingImage ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <Camera size={14} />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1 text-center sm:pt-2 sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="break-words text-lg font-bold tracking-tight text-[#18352b] dark:text-white sm:text-xl">
              {profile.name || t("ph_your_profile")}
            </h2>

            {roleLabel && (
              <span className="rounded-full bg-[#edf2e5] px-2.5 py-0.5 text-[11px] font-semibold text-[#267a44] dark:bg-emerald-950 dark:text-emerald-300">
                {roleLabel}
              </span>
            )}
          </div>

          <p className="mt-1 flex items-center justify-center gap-2 break-all text-xs text-gray-500 dark:text-gray-400 sm:justify-start">
            <Mail size={13} className="shrink-0" />
            {profile.email}
          </p>

          {profile.location?.district && (
            <p className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:justify-start">
              <MapPin size={13} className="shrink-0" />
              {profile.location.district}
              {profile.location.division && `, ${profile.location.division}`}
            </p>
          )}
        </div>

        {/* Edit Profile Button */}
        {onEdit && (
          <div className="flex w-full justify-center sm:w-auto sm:pt-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#1e5631] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#164223] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#267a44] focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:w-auto"
            >
              <Pencil size={14} />
              {t("ph_edit_profile")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}