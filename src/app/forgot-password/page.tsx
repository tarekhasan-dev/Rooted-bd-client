"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import "./forgot-password.css";

// styles.hero লিখলে "fp-hero" class হয়ে যায়
const styles = new Proxy({} as Record<string, string>, {
  get: (_, key) => `fp-${String(key)}`,
});

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 30;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [shake, setShake] = useState(false);

  const isValid = EMAIL_REGEX.test(email.trim());
  const showError = touched && !isValid && email.length > 0;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const progress =
    status === "success" ? 100 : isValid ? 66 : email.length > 0 ? 33 : 0;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const sendResetLink = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: "/reset-password",
      });
      if (error) throw new Error(error.message || "Something went wrong.");
      setStatus("success");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      triggerShake();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) {
      setStatus("error");
      setMessage("Please enter a valid e-mail address.");
      triggerShake();
      return;
    }
    sendResetLink();
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={`${styles.breadcrumb} ${styles.fadeUp}`} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/login">Login</Link>
          <span>/</span>
          <strong>Forgot password</strong>
        </nav>

        {/* HERO */}
        <section className={`${styles.hero} ${styles.fadeUp}`} style={{ animationDelay: "0.05s" }}>
          <div className={styles.heroLeft}>
            <div className={styles.tagRow}>
              <span className={styles.tag}>Account Recovery</span>
              <span className={`${styles.tag} ${styles.tagYellow}`}>
                {status === "success" ? "Sent" : "Secure"}
              </span>
            </div>
            <h1 className={styles.heroTitle}>Reset your password</h1>
            <p className={styles.heroDesc}>
              Every fresh start begins with a small step. Enter your e-mail and
              we will send a secure link so you can get back to your community.
            </p>

            <ul className={styles.infoList}>
              <li><span>✉️</span><div><small>Step</small><b>Enter e-mail</b></div></li>
              <li><span>⏱️</span><div><small>Link valid</small><b>1 hour</b></div></li>
              <li><span>🔒</span><div><small>Security</small><b>Encrypted</b></div></li>
              <li><span>🌱</span><div><small>Account</small><b>Your rooted.BD</b></div></li>
            </ul>

            <div className={styles.progressText}>
              <span>
                {status === "success" ? "All done" : isValid ? "Ready to send" : "Waiting for e-mail"}
              </span>
              <span>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <a href="#reset-form" className={styles.heroBtn}>Start filling the form ↓</a>
          </div>

          <div className={styles.heroRight} aria-hidden="true">
            <div className={styles.sun} />
            <div className={`${styles.cloud} ${styles.cloud1}`} />
            <div className={`${styles.cloud} ${styles.cloud2}`} />
            <div className={styles.hill} />
            <div className={`${styles.tree} ${styles.tree1}`}><i /><b /></div>
            <div className={`${styles.tree} ${styles.tree2}`}><i /><b /></div>
            <div className={`${styles.tree} ${styles.tree3}`}><i /><b /></div>
            <div className={styles.caption}><b>Fresh start.</b> One step at a time.</div>
          </div>
        </section>

        {/* GRID */}
        <div className={styles.grid}>
          <section
            id="reset-form"
            className={`${styles.card} ${styles.fadeUp} ${shake ? styles.shake : ""}`}
            style={{ animationDelay: "0.12s" }}
          >
            {status === "success" ? (
              <div className={styles.successBox}>
                <div className={styles.checkCircle}>
                  <svg viewBox="0 0 52 52" width="52" height="52">
                    <path
                      className={styles.checkPath}
                      d="M14 27 L23 36 L39 18"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Check your inbox</h2>
                <p className={styles.cardSub}>
                  We sent a reset link to <b>{email.trim()}</b>. Don&apos;t forget to check spam.
                </p>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={sendResetLink}
                  disabled={cooldown > 0}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
                </button>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                    setTouched(false);
                  }}
                >
                  Use a different e-mail
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className={styles.cardTitle}>Account information</h2>
                <p className={styles.cardSub}>Start with the e-mail you used to register.</p>

                <label htmlFor="email" className={styles.label}>
                  E-mail address <em>*</em>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  onBlur={() => setTouched(true)}
                  className={`${styles.input} ${showError ? styles.inputError : ""} ${
                    isValid ? styles.inputOk : ""
                  }`}
                />
                <p className={styles.hint}>
                  {showError ? "Please enter a valid e-mail." : "We will never share your e-mail."}
                </p>

                {status === "error" && message && (
                  <div className={styles.errorBox} role="alert">{message}</div>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? <span className={styles.spinner} /> : "Send Reset Link"}
                </button>

                <p className={styles.backText}>
                  Remember your password? <Link href="/login">Back to Login</Link>
                </p>
              </form>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={`${styles.sideCard} ${styles.fadeUp}`} style={{ animationDelay: "0.2s" }}>
              <h3>Reset steps</h3>
              <ol className={styles.steps}>
                <li className={styles.stepDone}><span>1</span>Enter your e-mail</li>
                <li className={status === "success" ? styles.stepDone : ""}><span>2</span>Open the link we send</li>
                <li><span>3</span>Set a new password</li>
              </ol>
            </div>

            <div className={`${styles.tipCard} ${styles.fadeUp}`} style={{ animationDelay: "0.28s" }}>
              <b>💡 A little tip</b>
              <p>Use a strong password with letters, numbers and symbols to keep your account safe.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}