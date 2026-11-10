
"use client";

import { useEffect, useState } from "react";

import {
  X,
  Save,
  UserRound,
  CalendarDays,
  MapPin,
  Phone,
  Heart,
  ChevronDown,
  Check,
} from "lucide-react";

import type {
  UserProfile,
  ProfileFormData,
} from "@/types/profile";

// Default Interest Categories
const INTEREST_CATEGORIES = [
  {
    title: "Environment & Nature",
    options: [
      "Tree Plantation",
      "Climate Action",
      "Wildlife Protection",
      "Clean Environment",
    ],
  },
  {
    title: "Education & Knowledge",
    options: [
      "Child Education",
      "Free Teaching",
      "Digital Literacy",
      "Youth Development",
    ],
  },
  {
    title: "Health & Wellbeing",
    options: [
      "Blood Donation",
      "Mental Health Awareness",
      "Health Awareness",
      "Community Healthcare",
    ],
  },
  {
    title: "Community & Humanity",
    options: [
      "Volunteering",
      "Food Distribution",
      "Helping the Poor",
      "Disaster Relief",
    ],
  },
  {
    title: "Social Equality",
    options: [
      "Women Empowerment",
      "Child Protection",
      "Disability Inclusion",
      "Human Rights",
    ],
  },
  {
    title: "Animal Welfare",
    options: [
      "Animal Rescue",
      "Animal Care",
      "Stray Animal Welfare",
    ],
  },
];

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileFormData) => void | Promise<void>;
  isSaving?: boolean;
}

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: EditProfileModalProps) {
  // Current year is not allowed for Date of Birth
  const maxDate = `${new Date().getFullYear() - 1}-12-31`;

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
    dateOfBirth: user.dateOfBirth || "",
    gender: user.gender || "",
    bio: user.bio || "",
    phone: (user.phone || "").replace(/[^0-9]/g, "").slice(0, 11),

    location: {
      division: user.location?.division || "",
      district: user.location?.district || "",
      upazila: user.location?.upazila || "",
      postalCode: user.location?.postalCode || "",
    },

    interests: user.interests || [],
  });

  const [isInterestDropdownOpen, setIsInterestDropdownOpen] =
    useState(false);

  const [dateError, setDateError] = useState("");

  // Update form when user data changes
  useEffect(() => {
    setFormData({
      name: user.name || "",
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
      bio: user.bio || "",
      phone: (user.phone || "").replace(/[^0-9]/g, "").slice(0, 11),

      location: {
        division: user.location?.division || "",
        district: user.location?.district || "",
        upazila: user.location?.upazila || "",
        postalCode: user.location?.postalCode || "",
      },

      interests: user.interests || [],
    });

    setDateError("");
    setIsInterestDropdownOpen(false);
  }, [user]);

  if (!isOpen) return null;

  // Handle General Input Changes
  const handleChange = (
    field: keyof ProfileFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Date of Birth Validation
  const handleDateChange = (value: string) => {
    if (value && value > maxDate) {
      setDateError(
        `Date of Birth must be before ${new Date().getFullYear()}.`
      );
      return;
    }

    setDateError("");

    handleChange("dateOfBirth", value);
  };

  // Handle Phone Number Validation
  const handlePhoneChange = (value: string) => {
    const numbersOnly = value
      .replace(/[^0-9]/g, "")
      .slice(0, 11);

    handleChange("phone", numbersOnly);
  };

  // Handle Location Changes
  const handleLocationChange = (
    field: keyof NonNullable<ProfileFormData["location"]>,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  // Handle Interest Selection
  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = prev.interests || [];

      const isSelected = currentInterests.includes(interest);

      // Remove selected interest
      if (isSelected) {
        return {
          ...prev,
          interests: currentInterests.filter(
            (item) => item !== interest
          ),
        };
      }

      // Maximum 10 interests
      if (currentInterests.length >= 10) {
        return prev;
      }

      // Add new interest
      return {
        ...prev,
        interests: [...currentInterests, interest],
      };
    });
  };

  // Handle Form Submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Validate Date of Birth
    if (
      formData.dateOfBirth &&
      formData.dateOfBirth > maxDate
    ) {
      setDateError(
        `Date of Birth must be before ${new Date().getFullYear()}.`
      );
      return;
    }

    setDateError("");

    await onSave({
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.replace(/[^0-9]/g, "").slice(0, 11),
      interests: formData.interests || [],
    });
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e1ece5] bg-[#fafcfb] px-4 py-3 text-sm text-[#18352b] outline-none transition placeholder:text-gray-400 focus:border-[#267a44] focus:ring-2 focus:ring-[#267a44]/10";

  const labelClass =
    "text-sm font-semibold text-[#18352b]";

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e1ece5] px-5 py-5 sm:px-7">
          <div>
            <h2
              id="edit-profile-title"
              className="text-xl font-bold text-[#18352b]"
            >
              Edit Profile
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Update your personal information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close edit profile"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-[#f4f8f5] hover:text-[#18352b] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[65vh] space-y-7 overflow-y-auto px-5 py-6 sm:px-7">

            {/* Personal Information */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <UserRound
                  size={18}
                  className="text-[#267a44]"
                />

                <h3 className="font-bold text-[#18352b]">
                  Personal Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      handleChange("name", e.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                    maxLength={100}
                    className={inputClass}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className={labelClass}>
                    Date of Birth
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78945c]"
                    />

                    <input
                      type="date"
                      value={formData.dateOfBirth || ""}
                      max={maxDate}
                      onChange={(e) =>
                        handleDateChange(e.target.value)
                      }
                      aria-invalid={!!dateError}
                      className={`${inputClass} pl-11 ${
                        dateError
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : ""
                      }`}
                    />
                  </div>

                  {dateError && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {dateError}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    Current year dates are not allowed.
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className={labelClass}>
                    Gender
                  </label>

                  <select
                    value={formData.gender || ""}
                    onChange={(e) =>
                      handleChange("gender", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </div>

                {/* About Me */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    About Me
                  </label>

                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) =>
                      handleChange("bio", e.target.value)
                    }
                    placeholder="Write something about yourself..."
                    rows={4}
                    maxLength={500}
                    className={`${inputClass} resize-none`}
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {(formData.bio || "").length}/500
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Phone
                  size={18}
                  className="text-[#267a44]"
                />

                <h3 className="font-bold text-[#18352b]">
                  Contact Information
                </h3>
              </div>

              <label className={labelClass}>
                Phone Number
              </label>

              <input
                type="tel"
                inputMode="numeric"
                value={formData.phone || ""}
                onChange={(e) =>
                  handlePhoneChange(e.target.value)
                }
                placeholder="Enter your phone number"
                maxLength={11}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                Only numbers (0-9), maximum 11 digits.
              </p>
            </section>

            {/* Location Information */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-[#267a44]"
                />

                <h3 className="font-bold text-[#18352b]">
                  Location Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Division */}
                <div>
                  <label className={labelClass}>
                    Division
                  </label>

                  <input
                    type="text"
                    value={formData.location?.division || ""}
                    onChange={(e) =>
                      handleLocationChange(
                        "division",
                        e.target.value
                      )
                    }
                    placeholder="Enter division"
                    className={inputClass}
                  />
                </div>

                {/* District */}
                <div>
                  <label className={labelClass}>
                    District
                  </label>

                  <input
                    type="text"
                    value={formData.location?.district || ""}
                    onChange={(e) =>
                      handleLocationChange(
                        "district",
                        e.target.value
                      )
                    }
                    placeholder="Enter district"
                    className={inputClass}
                  />
                </div>

                {/* Upazila */}
                <div>
                  <label className={labelClass}>
                    Upazila
                  </label>

                  <input
                    type="text"
                    value={formData.location?.upazila || ""}
                    onChange={(e) =>
                      handleLocationChange(
                        "upazila",
                        e.target.value
                      )
                    }
                    placeholder="Enter upazila"
                    className={inputClass}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className={labelClass}>
                    Postal Code
                  </label>

                  <input
                    type="text"
                    value={formData.location?.postalCode || ""}
                    onChange={(e) =>
                      handleLocationChange(
                        "postalCode",
                        e.target.value
                      )
                    }
                    placeholder="Enter postal code"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Interests & Causes */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Heart
                  size={18}
                  className="text-[#267a44]"
                />

                <h3 className="font-bold text-[#18352b]">
                  Interests & Causes
                </h3>
              </div>

              <label className={labelClass}>
                Choose Your Interests
              </label>

              {/* Dropdown Button */}
              <button
                type="button"
                onClick={() =>
                  setIsInterestDropdownOpen((prev) => !prev)
                }
                aria-expanded={isInterestDropdownOpen}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-[#e1ece5] bg-[#fafcfb] px-4 py-3 text-sm text-[#18352b] transition hover:border-[#267a44] focus:outline-none focus:ring-2 focus:ring-[#267a44]/10"
              >
                <span>
                  {(formData.interests || []).length > 0
                    ? `${formData.interests.length} interests selected`
                    : "Select your interests"}
                </span>

                <ChevronDown
                  size={19}
                  className={`text-[#78945c] transition-transform ${
                    isInterestDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Options */}
              {isInterestDropdownOpen && (
                <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-[#e1ece5] bg-white p-4 shadow-lg">

                  {INTEREST_CATEGORIES.map((category) => (
                    <div
                      key={category.title}
                      className="mb-5 last:mb-0"
                    >
                      <h4 className="mb-3 text-sm font-bold text-[#267a44]">
                        {category.title}
                      </h4>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {category.options.map((option) => {
                          const isSelected = (
                            formData.interests || []
                          ).includes(option);

                          const isLimitReached =
                            (formData.interests || []).length >= 10;

                          return (
                            <label
                              key={option}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                                isSelected
                                  ? "border-[#267a44] bg-[#edf5ee] text-[#164223]"
                                  : "border-[#e1ece5] text-gray-600 hover:bg-[#fafcfb]"
                              } ${
                                !isSelected && isLimitReached
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={
                                  !isSelected && isLimitReached
                                }
                                onChange={() =>
                                  handleInterestToggle(option)
                                }
                                className="checkbox checkbox-sm checkbox-success"
                              />

                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Interests */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500">
                    Selected Interests
                  </p>

                  <p className="text-xs font-medium text-[#267a44]">
                    {(formData.interests || []).length}/10
                  </p>
                </div>

                {(formData.interests || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 rounded-full border border-[#cfe3d3] bg-[#edf5ee] px-3 py-2 text-xs font-medium text-[#164223]"
                      >
                        {interest}

                        <button
                          type="button"
                          onClick={() =>
                            handleInterestToggle(interest)
                          }
                          aria-label={`Remove ${interest}`}
                          className="text-[#267a44] transition hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    No interests selected yet.
                  </p>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Select up to 10 interests that match your passion.
              </p>
            </section>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#e1ece5] bg-[#fafcfb] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-[#e1ece5] px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || !formData.name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e5631] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#164223] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
