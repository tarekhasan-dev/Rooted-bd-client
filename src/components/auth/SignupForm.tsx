"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { Field } from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";
import {
  MAX_PASSWORD_LENGTH,
  getPasswordIssue,
  getUnmetPasswordRules,
} from "@/lib/password-rules";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameOk = name.trim().length >= 2;
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const unmetRules = getUnmetPasswordRules(password);
  const passOk = unmetRules.length === 0 && password.length <= MAX_PASSWORD_LENGTH;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nameOk) return setError("Please enter your full name.");
    if (!emailOk) return setError("Please enter a valid email address.");

    const passwordIssue = getPasswordIssue(password);
    if (passwordIssue) return setError(passwordIssue);

    if (!agree) return setError("Please accept the Privacy & Policy.");

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });
    setLoading(false);
    if (error) return setError(error.message ?? "Could not create account.");
    router.push("/");
  }

  return (
    <AuthShell
      title="Sign up"
      subtitle="Show up. Plant something. Join your neighbourhood."
      artTitle="Plant a seed, watch Bangladesh bloom."
      artText="One tree is a small act. A thousand neighbours planting together is a movement."
      artCta="Host your first event"
    >
      <form className="auth-form auth-compact" onSubmit={onSubmit}>
        <Field
          id="name"
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          valid={nameOk}
        />
        <Field
          id="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          valid={emailOk}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 15 characters"
          valid={passOk}
        />

        {unmetRules.length > 0 && (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {unmetRules.map((rule) => (
              <li
                key={rule.id}
                className="auth-error"
                style={{ margin: "2px 0", fontSize: 12 }}
              >
                {rule.label}
              </li>
            ))}
          </ul>
        )}

        <label className="auth-check" style={{ fontSize: 12, color: "#4F6358" }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree to the{" "}
          <Link href="/privacy" className="auth-link">
            Privacy &amp; Policy
          </Link>
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button className="auth-btn yellow" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="auth-foot">
          Already part of rooted?{" "}
          <Link href="/login" className="auth-link">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}