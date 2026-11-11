"use client";

import { useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import CardShell from "@/components/profile/CardShell";

import { authClient } from "@/lib/auth-client";

import {
  MAX_PASSWORD_LENGTH,
  getPasswordIssue,
  getUnmetPasswordRules,
} from "@/lib/password-rules";

import type { UserProfile } from "@/types/profile";

interface SecurityCardProps {
  user: UserProfile;
}

const fieldLabelClass =
  "mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500";

const iconClass = "shrink-0 text-[#78945c]";

const labelClass =
  "text-xs font-semibold text-[#18352b] dark:text-gray-100";

const inputClass =
  "mt-1 w-full rounded-xl border border-[#e1ece5] bg-[#fafcfb] px-4 py-2.5 text-sm text-[#18352b] outline-none transition placeholder:text-gray-400 focus:border-[#267a44] focus:ring-2 focus:ring-[#267a44]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

export default function SecurityCard({ user }: SecurityCardProps) {
  const { t, lang } = useLang();

  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const unmetRules = getUnmetPasswordRules(newPassword);

  const showMismatch =
    confirmPassword.length > 0 && confirmPassword !== newPassword;

  // Translate Password Rule Messages
  const getTranslatedRule = (label: string) => {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.includes("length")) {
      return t("pr_password_rule_length");
    }

    if (
      normalizedLabel.includes("uppercase") ||
      normalizedLabel.includes("lowercase") ||
      normalizedLabel.includes("case")
    ) {
      return t("pr_password_rule_case");
    }

    if (normalizedLabel.includes("number")) {
      return t("pr_password_rule_number");
    }

    if (
      normalizedLabel.includes("special") ||
      normalizedLabel.includes("symbol")
    ) {
      return t("pr_password_rule_special");
    }

    return label;
  };

  // Translate Password Validation Errors
  const getTranslatedPasswordIssue = (issue: string) => {
    const normalizedIssue = issue.toLowerCase();

    if (normalizedIssue.includes("length")) {
      return t("pr_password_rule_length");
    }

    if (
      normalizedIssue.includes("uppercase") ||
      normalizedIssue.includes("lowercase") ||
      normalizedIssue.includes("case")
    ) {
      return t("pr_password_rule_case");
    }

    if (normalizedIssue.includes("number")) {
      return t("pr_password_rule_number");
    }

    if (
      normalizedIssue.includes("special") ||
      normalizedIssue.includes("symbol")
    ) {
      return t("pr_password_rule_special");
    }

    return t("pr_password_requirement");
  };

  // Format Account Creation Date
  const formatDate = (date?: string | null) => {
    if (!date) return t("pr_something_wrong");

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return t("pr_something_wrong");
    }

    return parsedDate.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Reset Password Form
  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // Cancel Password Update
  const handleCancel = () => {
    resetPasswordForm();
    setIsPasswordFormOpen(false);
  };

  // Handle Password Change
  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("pr_fill_password_fields"));
      return;
    }

    const passwordIssue = getPasswordIssue(newPassword);

    if (passwordIssue) {
      setPasswordError(getTranslatedPasswordIssue(passwordIssue));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("pr_new_password_mismatch"));
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(t("pr_same_password"));
      return;
    }

    try {
      setIsChanging(true);

      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setPasswordError(error.message || t("pr_change_password_failed"));
        return;
      }

      resetPasswordForm();
      setIsPasswordFormOpen(false);

      setPasswordSuccess(t("pr_password_changed"));
    } catch {
      setPasswordError(t("pr_something_wrong"));
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <CardShell
      icon={ShieldCheck}
      title={t("pr_security_title")}
      subtitle={t("pr_security_subtitle")}
    >
      {/* Same grid as Location card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Email Verification */}
        <div className="min-w-0">
          <p className={fieldLabelClass}>{t("pr_email_verification")}</p>

          <div className="flex items-center gap-2">
            {user.emailVerified ? (
              <CheckCircle2 size={15} className={iconClass} />
            ) : (
              <ShieldAlert size={15} className={iconClass} />
            )}

            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                user.emailVerified
                  ? "bg-[#edf2e5] text-[#267a44] dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}
            >
              {user.emailVerified ? t("pr_verified") : t("pr_pending")}
            </span>
          </div>

          <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            {user.emailVerified
              ? t("pr_email_verified_message")
              : t("pr_email_pending_message")}
          </p>
        </div>

        {/* Account Creation */}
        <div className="min-w-0">
          <p className={fieldLabelClass}>{t("pr_account_created")}</p>

          <div className="flex items-center gap-2">
            <CalendarDays size={15} className={iconClass} />

            <p className="text-[13px] font-medium text-[#18352b] dark:text-gray-100">
              {formatDate(user.accountCreatedAt)}
            </p>
          </div>
        </div>

        {/* Password Management */}
        <div className="min-w-0">
          <p className={fieldLabelClass}>{t("pr_password_management")}</p>

          <div className="flex items-center gap-2">
            <LockKeyhole size={15} className={iconClass} />

            <p className="text-[13px] font-medium text-[#18352b] dark:text-gray-100">
              ••••••••
            </p>
          </div>

          <p className="mt-1.5 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
            {t("pr_password_management_subtitle")}
          </p>

          {/* Password Success Message */}
          {passwordSuccess && (
            <p
              role="status"
              className="mt-2 rounded-lg bg-[#edf5ee] px-3 py-2 text-xs font-medium text-[#164223] dark:bg-emerald-950 dark:text-emerald-300"
            >
              {passwordSuccess}
            </p>
          )}

          {!isPasswordFormOpen && (
            <button
              type="button"
              onClick={() => {
                setPasswordSuccess("");
                setIsPasswordFormOpen(true);
              }}
              className="mt-2 rounded-lg border border-[#cfe3d3] px-3 py-1.5 text-xs font-semibold text-[#267a44] transition hover:bg-[#f4f8f5] dark:border-gray-700 dark:text-[#75d69a] dark:hover:bg-gray-800"
            >
              {t("pr_change_password")}
            </button>
          )}
        </div>

        {/* Password Form (full width when open) */}
        {isPasswordFormOpen && (
          <form
            onSubmit={handleChangePassword}
            className="space-y-4 rounded-2xl border border-[#e1ece5] bg-[#fafcfb] p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:col-span-2"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Current Password */}
              <div>
                <label htmlFor="current-password" className={labelClass}>
                  {t("pr_current_password")}
                </label>

                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new-password" className={labelClass}>
                  {t("pr_new_password")}
                </label>

                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  maxLength={MAX_PASSWORD_LENGTH}
                  className={inputClass}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className={labelClass}>
                  {t("pr_confirm_password")}
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={MAX_PASSWORD_LENGTH}
                  className={inputClass}
                  required
                />

                {showMismatch && (
                  <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                    {t("pr_password_mismatch")}
                  </p>
                )}
              </div>
            </div>

            {/* Password Rules */}
            {unmetRules.length > 0 && (
              <ul className="space-y-1">
                {unmetRules.map((rule) => (
                  <li
                    key={rule.id}
                    className="text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    {getTranslatedRule(rule.label)}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-xs leading-5 text-gray-400">
              {t("pr_password_hint")}
            </p>

            {/* Password Error */}
            {passwordError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-300"
              >
                {passwordError}
              </p>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isChanging}
                className="rounded-lg border border-[#e1ece5] px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-white disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t("pr_cancel")}
              </button>

              <button
                type="submit"
                disabled={isChanging}
                className="rounded-lg bg-[#1e5631] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#164223] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChanging ? t("pr_updating") : t("pr_update_password")}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Reminder */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#dce9dd] bg-[#f4f8f5] p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <ShieldCheck
          size={17}
          className="shrink-0 text-[#267a44] dark:text-[#75d69a]"
        />

        <p className="text-xs leading-5 text-[#42634d] dark:text-gray-300">
          {t("pr_security_reminder")}
        </p>
      </div>
    </CardShell>
  );
}