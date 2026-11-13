"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import "./../forgot-password/forgot-password.css";

const styles = new Proxy({} as Record<string, string>, {
  get: (_, key) => `fp-${String(key)}`,
});

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [tokenReady, setTokenReady] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  // Get reset token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token");

    if (resetToken) {
      setToken(resetToken);
    } else {
      setStatus("error");
      setMessage(
        "Invalid or missing reset link. Please request a new password reset link."
      );
    }

    setTokenReady(true);
  }, []);

  const isPasswordValid = password.length >= 8;

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  const showPasswordError = touched && !isPasswordValid;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched(true);
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Your reset link is invalid or expired. Please request a new one.");
      return;
    }

    if (!isPasswordValid) {
      setStatus("error");
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setStatus("error");
      setMessage("Password and confirm password do not match.");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        throw new Error(
          error.message || "Unable to reset your password."
        );
      }

      setStatus("success");
      setMessage("Your password has been changed successfully.");
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const progress =
    status === "success" ? 100 : passwordsMatch ? 100 : isPasswordValid ? 66 : password.length > 0 ? 33 : 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav
          className={`${styles.breadcrumb} ${styles.fadeUp}`}
          aria-label="Breadcrumb"
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/login">Login</Link>
          <span>/</span>
          <strong>Reset password</strong>
        </nav>

        {/* HERO */}
        <section
          className={`${styles.hero} ${styles.fadeUp}`}
          style={{ animationDelay: "0.05s" }}
        >
          <div className={styles.heroLeft}>
            <div className={styles.tagRow}>
              <span className={styles.tag}>Account Security</span>

              <span className={`${styles.tag} ${styles.tagYellow}`}>
                {status === "success" ? "Completed" : "Secure"}
              </span>
            </div>

            <h1 className={styles.heroTitle}>Create a new password</h1>

            <p className={styles.heroDesc}>
              You are almost back to your community. Choose a strong new
              password to secure your rooted.BD account.
            </p>

            <ul className={styles.infoList}>
              <li>
                <span>01</span>
                <div>
                  <small>First step</small>
                  <b>Enter new password</b>
                </div>
              </li>

              <li>
                <span>02</span>
                <div>
                  <small>Second step</small>
                  <b>Confirm password</b>
                </div>
              </li>

              <li>
                <span>03</span>
                <div>
                  <small>Final step</small>
                  <b>Secure your account</b>
                </div>
              </li>

              <li>
                <span>04</span>
                <div>
                  <small>Access</small>
                  <b>Return to rooted.BD</b>
                </div>
              </li>
            </ul>

            <div className={styles.progressText}>
              <span>
                {status === "success"
                  ? "Password updated"
                  : passwordsMatch
                    ? "Ready to reset"
                    : "Create your password"}
              </span>

              <span>{progress}%</span>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <a href="#reset-form" className={styles.heroBtn}>
              Set your new password ↓
            </a>
          </div>

          <div className={styles.heroRight} aria-hidden="true">
            <div className={styles.sun} />
            <div className={`${styles.cloud} ${styles.cloud1}`} />
            <div className={`${styles.cloud} ${styles.cloud2}`} />
            <div className={styles.hill} />

            <div className={`${styles.tree} ${styles.tree1}`}>
              <i />
              <b />
            </div>

            <div className={`${styles.tree} ${styles.tree2}`}>
              <i />
              <b />
            </div>

            <div className={`${styles.tree} ${styles.tree3}`}>
              <i />
              <b />
            </div>

            <div className={styles.caption}>
              <b>New beginning.</b> A safer account.
            </div>
          </div>
        </section>

        {/* FORM GRID */}
        <div className={styles.grid}>
          <section id="reset-form" className={styles.card}>
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

                <h2 className={styles.cardTitle}>
                  Password updated!
                </h2>

                <p className={styles.cardSub}>
                  Your password has been changed successfully. You can now
                  sign in using your new password.
                </p>

                <Link href="/login" className={styles.submitBtn}>
                  Continue to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className={styles.cardTitle}>
                  Create new password
                </h2>

                <p className={styles.cardSub}>
                  Choose a strong password for your account.
                </p>

                {!tokenReady && (
                  <div className={styles.hint}>
                    Verifying your reset link...
                  </div>
                )}

                {tokenReady && !token && (
                  <div className={styles.errorBox} role="alert">
                    {message}
                    <p>
                      <Link href="/forgot-password">
                        Request a new reset link
                      </Link>
                    </p>
                  </div>
                )}

                {token && (
                  <>
                    <div className={styles.field}>
                      <label
                        htmlFor="new-password"
                        className={styles.label}
                      >
                        New password <em>*</em>
                      </label>

                      <input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);

                          if (status === "error") {
                            setStatus("idle");
                            setMessage("");
                          }
                        }}
                        onBlur={() => setTouched(true)}
                        className={`${styles.input} ${
                          showPasswordError ? styles.inputError : ""
                        } ${
                          isPasswordValid ? styles.inputOk : ""
                        }`}
                        disabled={status === "loading"}
                      />

                      <p className={styles.hint}>
                        {showPasswordError
                          ? "Password must contain at least 8 characters."
                          : "Use at least 8 characters."}
                      </p>
                    </div>

                    <div className={styles.field}>
                      <label
                        htmlFor="confirm-password"
                        className={styles.label}
                      >
                        Confirm new password <em>*</em>
                      </label>

                      <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);

                          if (status === "error") {
                            setStatus("idle");
                            setMessage("");
                          }
                        }}
                        className={`${styles.input} ${
                          confirmPassword.length > 0 && !passwordsMatch
                            ? styles.inputError
                            : ""
                        } ${
                          passwordsMatch ? styles.inputOk : ""
                        }`}
                        disabled={status === "loading"}
                      />

                      <p className={styles.hint}>
                        {confirmPassword.length > 0 && !passwordsMatch
                          ? "Passwords do not match."
                          : "Enter the same password again."}
                      </p>
                    </div>

                    {status === "error" && message && (
                      <div className={styles.errorBox} role="alert">
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={status === "loading" || !tokenReady}
                    >
                      {status === "loading" ? (
                        <span className={styles.spinner} />
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </>
                )}

                <p className={styles.backText}>
                  Remember your password?{" "}
                  <Link href="/login">Back to Login</Link>
                </p>
              </form>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Password checklist</h3>

              <ol className={styles.steps}>
                <li className={isPasswordValid ? styles.stepDone : ""}>
                  <span>1</span>
                  At least 8 characters
                </li>

                <li className={passwordsMatch ? styles.stepDone : ""}>
                  <span>2</span>
                  Passwords match
                </li>

                <li className={status === "success" ? styles.stepDone : ""}>
                  <span>3</span>
                  Password updated
                </li>
              </ol>
            </div>

            <div className={styles.tipCard}>
              <b>Security tip</b>

              <p>
                Avoid reusing old passwords. A unique password helps keep
                your account protected.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}