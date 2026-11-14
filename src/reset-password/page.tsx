
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { Field } from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError("Password must be between 8 and 16 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(error.message ?? "Unable to reset password.");
        return;
      }

      setMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Create a new password for your Rooted BD account."
      artTitle="নতুন করে শুরু হোক"
      artText={"নতুন স্বপ্ন, নতুন পথচলা,\nবিশ্বাসে গড়ুক আগামীকাল।"}
      artCta="Explore upcoming events"
    >
      <form className="auth-form auth-compact" onSubmit={onSubmit}>
        <Field
          id="password"
          label="New Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter new password"
        />

        <Field
          id="confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm new password"
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="auth-success" role="status">
            {message}
          </p>
        )}

        <button
          className="auth-btn teal"
          disabled={loading || !token}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="auth-foot">
          Remember your password?{" "}
          <Link href="/login" className="auth-link">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
