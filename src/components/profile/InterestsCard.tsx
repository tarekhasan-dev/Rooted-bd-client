
"use client";

import type { UserProfile } from "@/types/profile";

import { Heart, Pencil } from "lucide-react";

import { useLang } from "@/components/LanguageProvider";

interface InterestsCardProps {
  user: UserProfile;
  onEdit?: () => void;
}

// Interest Translation Mapping
const interestTranslationKeys: Record<string, string> = {
  // Environment & Nature
  "Environmental Protection": "interest_environment",
  "Tree Plantation": "interest_tree",
  "Climate Change": "interest_climate",
  "Climate Action": "interest_climate",
  "Wildlife Conservation": "interest_wildlife",
  "Wildlife Protection": "interest_wildlife",
  "Clean Environment": "interest_clean_environment",

  // Education & Knowledge
  Education: "interest_education",
  "Child Education": "interest_child_education",
  "Free Teaching": "interest_free_teaching",
  "Digital Literacy": "interest_digital_literacy",
  "Youth Development": "interest_youth_development",

  // Health & Wellbeing
  Health: "interest_health",
  "Blood Donation": "interest_blood_donation",
  "Mental Health": "interest_mental_health",
  "Mental Health Awareness": "interest_mental_health",
  "Health Awareness": "interest_health_awareness",
  "Community Healthcare": "interest_community_healthcare",

  // Community & Humanity
  "Community Development": "interest_community",
  Volunteering: "interest_volunteering",
  "Food Distribution": "interest_food_distribution",
  "Helping Poor People": "interest_helping_poor",
  "Helping the Poor": "interest_helping_poor",
  "Disaster Relief": "interest_disaster_relief",

  // Social Equality
  Equality: "interest_equality",
  "Social Equality": "interest_equality",
  "Women Empowerment": "interest_women_empowerment",
  "Child Protection": "interest_child_protection",
  "Disability Inclusion": "interest_disability_inclusion",
  "Human Rights": "interest_human_rights",

  // Animal Welfare
  "Animal Welfare": "interest_animal",
  "Animal Rescue": "interest_animal_rescue",
  "Animal Care": "interest_animal_care",
  "Stray Animals": "interest_stray_animals",
  "Stray Animal Welfare": "interest_stray_animals",
};

export default function InterestsCard({
  user,
  onEdit,
}: InterestsCardProps) {
  const { t } = useLang();

  // Translate Interest Names
  const getInterestLabel = (interest: string) => {
    const translationKey = interestTranslationKeys[interest];

    if (!translationKey) {
      return interest;
    }

    return t(translationKey as Parameters<typeof t>[0]);
  };

  return (
    <div className="rounded-2xl border border-[#e1ece5] bg-white p-6 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#edf2e5] p-3 text-[#267A44] dark:bg-[#1d3829] dark:text-[#75d69a]">
            <Heart size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#164223] dark:text-gray-100">
              {t("pr_interests_title")}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("pr_interests_subtitle")}
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-[#267A44] transition-colors hover:bg-[#edf2e5] dark:text-[#75d69a] dark:hover:bg-gray-800"
            aria-label={t("pr_edit_interests")}
            title={t("pr_edit_interests")}
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
              className="rounded-full border border-[#e1ece5] bg-[#edf2e5] px-4 py-2 text-sm font-medium text-[#267A44] transition-colors duration-300 dark:border-[#365443] dark:bg-[#1d3829] dark:text-[#9be6b5]"
            >
              {getInterestLabel(interest)}
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-[#fafcfb] px-4 py-8 text-center dark:bg-gray-800">
          <Heart
            size={28}
            className="mx-auto mb-2 text-gray-300 dark:text-gray-500"
          />

          <p className="text-sm text-gray-500 dark:text-gray-300">
            {t("pr_no_interests")}
          </p>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {t("pr_add_interests")}
          </p>
        </div>
      )}

    </div>
  );
}
