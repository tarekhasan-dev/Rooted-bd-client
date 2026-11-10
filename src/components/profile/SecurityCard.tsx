import {
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import type { UserProfile } from "@/types/profile";

interface SecurityCardProps {
  user: UserProfile;
}

export default function SecurityCard({ user }: SecurityCardProps) {
  const formatDate = (date?: string | null) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="rounded-3xl border border-[#e1ece5] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2e5] text-[#267a44]">
          <ShieldCheck size={20} />
        </span>

        <div>
          <h2 className="text-lg font-bold text-[#18352b]">
            Account & Security
          </h2>

          <p className="text-xs text-gray-500">
            Your account security information
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Email Verification */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44]">
            {user.emailVerified ? (
              <CheckCircle2 size={19} />
            ) : (
              <ShieldAlert size={19} />
            )}
          </span>

          <div className="flex-1">
            <p className="text-sm font-semibold text-[#18352b]">
              Email Verification
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {user.emailVerified
                ? "Your email address has been verified."
                : "Your email address is not verified yet."}
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                user.emailVerified
                  ? "bg-[#edf2e5] text-[#267a44]"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {user.emailVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>

        {/* Account Creation */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44]">
            <CalendarDays size={19} />
          </span>

          <div>
            <p className="text-sm font-semibold text-[#18352b]">
              Account Created
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {formatDate(user.accountCreatedAt)}
            </p>
          </div>
        </div>

        {/* Password Management */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#267a44]">
            <LockKeyhole size={19} />
          </span>

          <div>
            <p className="text-sm font-semibold text-[#18352b]">
              Password Management
            </p>

            <p className="mt-1 text-xs leading-6 text-gray-500">
              Your password is managed securely by the authentication
              system. Password changes can be connected here later.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#dce9dd] bg-[#f4f8f5] p-4">
        <ShieldCheck size={19} className="shrink-0 text-[#267a44]" />

        <p className="text-xs leading-5 text-[#42634d]">
          Keep your account information accurate and never share your
          password or authentication credentials with anyone.
        </p>
      </div>
    </section>
  );
}