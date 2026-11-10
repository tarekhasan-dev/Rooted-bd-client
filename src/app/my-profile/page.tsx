
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
} from "@/services/profileApi";

import type {
  UserProfile,
  ProfileFormData,
} from "@/types/profile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ContactCard from "@/components/profile/ContactCard";
import LocationCard from "@/components/profile/LocationCard";
import InterestsCard from "@/components/profile/InterestsCard";
import SecurityCard from "@/components/profile/SecurityCard";
import EditProfileModal from "@/components/profile/EditProfileModal";

// Toast Types
type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
  title: string;
  message: string;
  type: ToastType;
}

const TOAST_DURATION = 2000;
const TOAST_EXIT_DURATION = 400;

const toastStyles = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    border: "border-green-100",
    title: "Success",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    border: "border-red-100",
    title: "Error",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    border: "border-amber-100",
    title: "Warning",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    border: "border-blue-100",
    title: "Information",
  },
};

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [toast, setToast] = useState<ToastData | null>(null);
  const [isToastExiting, setIsToastExiting] = useState(false);

  // Toast Auto Dismiss
  useEffect(() => {
    if (!toast) return;

    setIsToastExiting(false);

    const exitTimer = window.setTimeout(() => {
      setIsToastExiting(true);
    }, TOAST_DURATION - TOAST_EXIT_DURATION);

    const removeTimer = window.setTimeout(() => {
      setToast(null);
      setIsToastExiting(false);
    }, TOAST_DURATION);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toast]);

  // Show Toast
  const showToast = (
    message: string,
    type: ToastType,
    title?: string
  ) => {
    setToast({
      title: title || toastStyles[type].title,
      message,
      type,
    });
  };

  // Fetch Profile
  const fetchProfile = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const data = await getMyProfile();

      setProfile(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile!"
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle Profile Update
  const handleProfileUpdate = async (
    formData: ProfileFormData
  ) => {
    try {
      setIsSaving(true);

      await updateMyProfile(formData);

      await fetchProfile(false);

      setIsEditModalOpen(false);

      showToast(
        "Your profile has been updated successfully!",
        "success",
        "Success"
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to update profile!",
        "error",
        "Error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Profile Image Upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploadingImage(true);

      const result = await uploadProfileImage(file, "profile");

      if (!result.success) {
        throw new Error(
          result.message || "Image upload failed!"
        );
      }

      await fetchProfile(false);

      showToast(
        "Your profile picture has been updated successfully!",
        "success",
        "Success"
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture!",
        "error",
        "Error"
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafcfb] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#267A44]" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#fafcfb] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
              Unable to Load Profile
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Profile information is unavailable."}
            </p>

            <button
              type="button"
              onClick={() => fetchProfile()}
              className="mt-6 rounded-lg bg-[#267A44] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#164223]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const activeToastStyle = toast
    ? toastStyles[toast.type]
    : null;

  const ToastIcon = activeToastStyle?.icon;

  return (
    <main className="min-h-screen bg-[#fafcfb] px-4 py-10 sm:px-6 lg:px-8">

      {/* Toast Exit Animation */}
      <style jsx global>{`
        @keyframes toastExit {
          from {
            opacity: 1;
            transform: translateY(0);
          }

          to {
            opacity: 0;
            transform: translateY(-15px);
          }
        }

        .toast-exit {
          animation: toastExit 400ms ease forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .toast-exit {
            animation: none;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {toast && activeToastStyle && ToastIcon && (
        <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] justify-end sm:right-6 sm:top-6 sm:w-auto">

          <div
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
            className={`pointer-events-auto relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-full border ${activeToastStyle.border} bg-white px-5 py-4 shadow-xl shadow-gray-900/10 ${
              isToastExiting ? "toast-exit" : ""
            }`}
          >
            {/* Toast Icon */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activeToastStyle.iconBg}`}
            >
              <ToastIcon
                size={22}
                className={activeToastStyle.iconColor}
              />
            </div>

            {/* Toast Content */}
            <div className="min-w-0 flex-1 py-1">
              <h3 className="text-sm font-bold text-gray-900">
                {toast.title}
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Close notification"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={17} />
            </button>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-8">

        {/* Page Heading */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#267A44]">
            rooted.BD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#164223] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          user={profile}
          onEdit={() => setIsEditModalOpen(true)}
          onImageUpload={handleImageUpload}
          isUploadingImage={isUploadingImage}
          onValidationError={(message) =>
            showToast(message, "error", "Invalid File")
          }
        />

        {/* Profile Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <PersonalInfoCard
            user={profile}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <ContactCard
            user={profile}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <LocationCard
            user={profile}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <InterestsCard
            user={profile}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <div className="lg:col-span-2">
            <SecurityCard user={profile} />
          </div>

        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          user={profile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileUpdate}
          isSaving={isSaving}
        />

      </div>
    </main>
  );
}
