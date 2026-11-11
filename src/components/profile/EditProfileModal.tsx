
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
} from "lucide-react";

import { useLang } from "@/components/LanguageProvider";

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

// Interest translations
const INTEREST_TRANSLATIONS: Record<string, string> = {
  "Environment & Nature": "পরিবেশ ও প্রকৃতি",
  "Tree Plantation": "বৃক্ষরোপণ",
  "Climate Action": "জলবায়ু পরিবর্তন মোকাবিলা",
  "Wildlife Protection": "বন্যপ্রাণী সংরক্ষণ",
  "Clean Environment": "পরিচ্ছন্ন পরিবেশ",

  "Education & Knowledge": "শিক্ষা ও জ্ঞান",
  "Child Education": "শিশু শিক্ষা",
  "Free Teaching": "বিনামূল্যে শিক্ষা প্রদান",
  "Digital Literacy": "ডিজিটাল সাক্ষরতা",
  "Youth Development": "যুব উন্নয়ন",

  "Health & Wellbeing": "স্বাস্থ্য ও সুস্থতা",
  "Blood Donation": "রক্তদান",
  "Mental Health Awareness": "মানসিক স্বাস্থ্য সচেতনতা",
  "Health Awareness": "স্বাস্থ্য সচেতনতা",
  "Community Healthcare": "কমিউনিটি স্বাস্থ্যসেবা",

  "Community & Humanity": "সমাজ ও মানবতা",
  Volunteering: "স্বেচ্ছাসেবামূলক কাজ",
  "Food Distribution": "খাদ্য বিতরণ",
  "Helping the Poor": "দরিদ্র মানুষের সহায়তা",
  "Disaster Relief": "দুর্যোগে সহায়তা",

  "Social Equality": "সামাজিক সমতা",
  "Women Empowerment": "নারীর ক্ষমতায়ন",
  "Child Protection": "শিশু সুরক্ষা",
  "Disability Inclusion": "প্রতিবন্ধী ব্যক্তিদের অন্তর্ভুক্তি",
  "Human Rights": "মানবাধিকার",

  "Animal Welfare": "প্রাণী কল্যাণ",
  "Animal Rescue": "প্রাণী উদ্ধার",
  "Animal Care": "প্রাণীর যত্ন",
  "Stray Animal Welfare": "পথপ্রাণীর কল্যাণ",
};

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
  const { lang } = useLang();

  const isBangla = lang === "bn";

  // Modal translations
  const translations = {
    title: isBangla ? "প্রোফাইল সম্পাদনা" : "Edit Profile",
    subtitle: isBangla
      ? "আপনার ব্যক্তিগত তথ্য আপডেট করুন"
      : "Update your personal information",

    personalInfo: isBangla
      ? "ব্যক্তিগত তথ্য"
      : "Personal Information",

    fullName: isBangla ? "পুরো নাম" : "Full Name",
    fullNamePlaceholder: isBangla
      ? "আপনার পুরো নাম লিখুন"
      : "Enter your full name",

    dateOfBirth: isBangla
      ? "জন্ম তারিখ"
      : "Date of Birth",

    dateError: (year: number) =>
      isBangla
        ? `জন্ম তারিখ অবশ্যই ${year} সালের আগে হতে হবে।`
        : `Date of Birth must be before ${year}.`,

    currentYearRestriction: isBangla
      ? "বর্তমান বছরের তারিখ গ্রহণযোগ্য নয়।"
      : "Current year dates are not allowed.",

    gender: isBangla ? "লিঙ্গ" : "Gender",
    selectGender: isBangla ? "লিঙ্গ নির্বাচন করুন" : "Select gender",
    male: isBangla ? "পুরুষ" : "Male",
    female: isBangla ? "নারী" : "Female",
    other: isBangla ? "অন্যান্য" : "Other",
    preferNotToSay: isBangla
      ? "জানাতে অনিচ্ছুক"
      : "Prefer not to say",

    aboutMe: isBangla ? "আমার সম্পর্কে" : "About Me",
    bioPlaceholder: isBangla
      ? "নিজের সম্পর্কে কিছু লিখুন..."
      : "Write something about yourself...",

    contactInfo: isBangla
      ? "যোগাযোগের তথ্য"
      : "Contact Information",

    phoneNumber: isBangla
      ? "ফোন নম্বর"
      : "Phone Number",

    phonePlaceholder: isBangla
      ? "আপনার ফোন নম্বর লিখুন"
      : "Enter your phone number",

    phoneHint: isBangla
      ? "শুধুমাত্র সংখ্যা (০-৯), সর্বোচ্চ ১১টি অঙ্ক।"
      : "Only numbers (0-9), maximum 11 digits.",

    locationInfo: isBangla
      ? "ঠিকানার তথ্য"
      : "Location Information",

    division: isBangla ? "বিভাগ" : "Division",
    divisionPlaceholder: isBangla
      ? "বিভাগ লিখুন"
      : "Enter division",

    district: isBangla ? "জেলা" : "District",
    districtPlaceholder: isBangla
      ? "জেলা লিখুন"
      : "Enter district",

    upazila: isBangla ? "উপজেলা" : "Upazila",
    upazilaPlaceholder: isBangla
      ? "উপজেলা লিখুন"
      : "Enter upazila",

    postalCode: isBangla ? "পোস্টাল কোড" : "Postal Code",
    postalCodePlaceholder: isBangla
      ? "পোস্টাল কোড লিখুন"
      : "Enter postal code",

    interestsTitle: isBangla
      ? "আগ্রহ ও সামাজিক উদ্যোগ"
      : "Interests & Causes",

    chooseInterests: isBangla
      ? "আপনার আগ্রহের বিষয় নির্বাচন করুন"
      : "Choose Your Interests",

    selectInterests: isBangla
      ? "আগ্রহের বিষয় নির্বাচন করুন"
      : "Select your interests",

    interestsSelected: (count: number) =>
      isBangla
        ? `${count}টি আগ্রহের বিষয় নির্বাচিত`
        : `${count} interests selected`,

    selectedInterests: isBangla
      ? "নির্বাচিত আগ্রহের বিষয়"
      : "Selected Interests",

    noInterests: isBangla
      ? "এখনো কোনো আগ্রহের বিষয় নির্বাচন করা হয়নি।"
      : "No interests selected yet.",

    interestLimit: isBangla
      ? "আপনার আগ্রহের সঙ্গে মেলে এমন সর্বোচ্চ ১০টি বিষয় নির্বাচন করুন।"
      : "Select up to 10 interests that match your passion.",

    cancel: isBangla ? "বাতিল" : "Cancel",
    saveChanges: isBangla
      ? "পরিবর্তন সংরক্ষণ করুন"
      : "Save Changes",

    saving: isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving...",

    closeModal: isBangla
      ? "প্রোফাইল সম্পাদনা বন্ধ করুন"
      : "Close edit profile",

    removeInterest: (interest: string) =>
      isBangla
        ? `${INTEREST_TRANSLATIONS[interest] || interest} সরিয়ে দিন`
        : `Remove ${interest}`,
  };

  // Current year is not allowed for Date of Birth
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 1}-12-31`;

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
    dateOfBirth: user.dateOfBirth || "",
    gender: user.gender || "",
    bio: user.bio || "",
    phone: (user.phone || "")
      .replace(/[^0-9]/g, "")
      .slice(0, 11),

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
      phone: (user.phone || "")
        .replace(/[^0-9]/g, "")
        .slice(0, 11),

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

  // Translate interest labels without changing stored values
  const getInterestLabel = (interest: string) => {
    if (!isBangla) return interest;

    return INTEREST_TRANSLATIONS[interest] || interest;
  };

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
      setDateError(translations.dateError(currentYear));
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

    if (
      formData.dateOfBirth &&
      formData.dateOfBirth > maxDate
    ) {
      setDateError(translations.dateError(currentYear));
      return;
    }

    setDateError("");

    await onSave({
      ...formData,
      name: formData.name.trim(),
      phone: (formData.phone || "")
        .replace(/[^0-9]/g, "")
        .slice(0, 11),
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
              {translations.title}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {translations.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={translations.closeModal}
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
                  {translations.personalInfo}
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    {translations.fullName}
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      handleChange("name", e.target.value)
                    }
                    placeholder={translations.fullNamePlaceholder}
                    required
                    maxLength={100}
                    className={inputClass}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className={labelClass}>
                    {translations.dateOfBirth}
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
                    {translations.currentYearRestriction}
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className={labelClass}>
                    {translations.gender}
                  </label>

                  <select
                    value={formData.gender || ""}
                    onChange={(e) =>
                      handleChange("gender", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">
                      {translations.selectGender}
                    </option>

                    <option value="Male">
                      {translations.male}
                    </option>

                    <option value="Female">
                      {translations.female}
                    </option>

                    <option value="Other">
                      {translations.other}
                    </option>

                    <option value="Prefer not to say">
                      {translations.preferNotToSay}
                    </option>
                  </select>
                </div>

                {/* About Me */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    {translations.aboutMe}
                  </label>

                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) =>
                      handleChange("bio", e.target.value)
                    }
                    placeholder={translations.bioPlaceholder}
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
                  {translations.contactInfo}
                </h3>
              </div>

              <label className={labelClass}>
                {translations.phoneNumber}
              </label>

              <input
                type="tel"
                inputMode="numeric"
                value={formData.phone || ""}
                onChange={(e) =>
                  handlePhoneChange(e.target.value)
                }
                placeholder={translations.phonePlaceholder}
                maxLength={11}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                {translations.phoneHint}
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
                  {translations.locationInfo}
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Division */}
                <div>
                  <label className={labelClass}>
                    {translations.division}
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
                    placeholder={translations.divisionPlaceholder}
                    className={inputClass}
                  />
                </div>

                {/* District */}
                <div>
                  <label className={labelClass}>
                    {translations.district}
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
                    placeholder={translations.districtPlaceholder}
                    className={inputClass}
                  />
                </div>

                {/* Upazila */}
                <div>
                  <label className={labelClass}>
                    {translations.upazila}
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
                    placeholder={translations.upazilaPlaceholder}
                    className={inputClass}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className={labelClass}>
                    {translations.postalCode}
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
                    placeholder={translations.postalCodePlaceholder}
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
                  {translations.interestsTitle}
                </h3>
              </div>

              <label className={labelClass}>
                {translations.chooseInterests}
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
                    ? translations.interestsSelected(
                        (formData.interests || []).length
                      )
                    : translations.selectInterests}
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
                        {getInterestLabel(category.title)}
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

                              <span>
                                {getInterestLabel(option)}
                              </span>
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
                    {translations.selectedInterests}
                  </p>

                  <p className="text-xs font-medium text-[#267a44]">
                    {(formData.interests || []).length}/10
                  </p>
                </div>

                {(formData.interests || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(formData.interests || []).map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 rounded-full border border-[#cfe3d3] bg-[#edf5ee] px-3 py-2 text-xs font-medium text-[#164223]"
                      >
                        {getInterestLabel(interest)}

                        <button
                          type="button"
                          onClick={() =>
                            handleInterestToggle(interest)
                          }
                          aria-label={translations.removeInterest(
                            interest
                          )}
                          className="text-[#267a44] transition hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    {translations.noInterests}
                  </p>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-400">
                {translations.interestLimit}
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
              {translations.cancel}
            </button>

            <button
              type="submit"
              disabled={isSaving || !formData.name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e5631] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#164223] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {isSaving
                ? translations.saving
                : translations.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
