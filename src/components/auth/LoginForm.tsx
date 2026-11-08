"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { Field } from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please enter your e-mail and password.");
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password, rememberMe: remember, callbackURL: "/" });
    setLoading(false);
    if (error) return setError(error.message ?? "Invalid e-mail or password.");
    router.push("/");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to find and join events near you."
                artTitle="Roots grow when you show up."
      artText="Pick up where you left off. Your next green moment is one event away."
      artCta="Explore upcoming events"
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <Field id="email" label="E-mail" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />
        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link href="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-btn teal" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p className="auth-foot">New to rooted? <Link href="/signup" className="auth-link">Sign up</Link></p>
      </form>
    </AuthShell>
  );
}