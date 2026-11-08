"use client";

import "@/styles/auth.css";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces } from "next/font/google";
import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["700"], variable: "--font-fraunces" });

const Tick = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export function Field({
  id, label, type = "text", value, onChange, placeholder, valid,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; valid?: boolean;
}) {
  return (
    <div>
      <label className="auth-label" htmlFor={id}>{label}</label>
      <div className={`auth-field ${valid ? "valid" : ""}`}>
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        {valid && <span className="auth-tick"><Tick /></span>}
      </div>
    </div>
  );
}

export function SocialButtons() {
  const go = (provider: "google" | "apple") =>
    authClient.signIn.social({ provider, callbackURL: "/" });
  return (
    <div className="auth-social">
      <button type="button" className="auth-sbtn" onClick={() => go("google")}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6z" />
          <path fill="#34A853" d="M12 22c2.8 0 5.1-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22z" />
          <path fill="#FBBC05" d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9.2z" />
          <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 2.7 7.1l3.5 2.7C7 7.8 9.3 6 12 6z" />
        </svg>
        Google
      </button>
      <button type="button" className="auth-sbtn" onClick={() => go("apple")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1B4D3A" aria-hidden="true">
          <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-.9-2.5-3.8zM14.1 5.7c.6-.8 1.1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.3z" />
        </svg>
        Apple
      </button>
    </div>
  );
}

export default function AuthShell({
  title, subtitle, artTitle, artText, artCta, artHref = "/events", children,
}: {
  title: string; subtitle: string; artTitle: React.ReactNode;
  artText: string; artCta: string; artHref?: string; children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className={`auth-wrap ${fraunces.variable}`}>
      <Link href="/" className="auth-back">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="auth-card">
        <div className="auth-left">
          <Link href="/" className="auth-brand">
            <span className="auth-brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
                <path d="M5 19c3-4 6-7 10-9" />
              </svg>
            </span>
            <span className="auth-brand-text">rooted<span style={{ color: "#F2B52A" }}>.</span><small>BD</small></span>
          </Link>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          <SocialButtons />
          <div className="auth-divider">or use your email</div>
          {children}
        </div>

        <div className="auth-art">
         <svg viewBox="0 0 520 700" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
            <defs>
              <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F3FBE3" />
                <stop offset="1" stopColor="#CFE9C2" />
              </linearGradient>
              <radialGradient id="auth-glow">
                <stop offset="0" stopColor="#FFE9A8" stopOpacity=".9" />
                <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="520" height="700" fill="url(#auth-sky)" />

            <circle cx="400" cy="120" r="110" fill="url(#auth-glow)" />
            <circle cx="400" cy="120" r="46" fill="#FBD56B" />

            <g className="auth-cloud auth-cloud-a">
              <ellipse cx="120" cy="110" rx="52" ry="13" fill="#fff" opacity=".8" />
              <ellipse cx="148" cy="98" rx="30" ry="12" fill="#fff" opacity=".8" />
            </g>
            <g className="auth-cloud auth-cloud-b">
              <ellipse cx="300" cy="190" rx="38" ry="10" fill="#fff" opacity=".6" />
              <ellipse cx="320" cy="181" rx="22" ry="9" fill="#fff" opacity=".6" />
            </g>

            <path d="M-20 360 C80 310 180 320 270 350 C360 380 440 330 540 340 V720 H-20Z" fill="#BFE0B0" />
            <path d="M-20 405 C90 365 200 380 290 400 C380 420 450 385 540 395 V720 H-20Z" fill="#A9D49B" />
            <path d="M-20 450 C110 425 220 430 300 445 C390 460 460 440 540 448 V720 H-20Z" fill="#8B4A2B" />

            <rect x="70" y="250" width="12" height="195" rx="6" fill="#7A4A2A" />
            <circle cx="76" cy="232" r="52" fill="#4E9A5C" />
            <circle cx="46" cy="274" r="33" fill="#63AB6C" />
            <circle cx="108" cy="272" r="33" fill="#63AB6C" />

            <rect x="440" y="290" width="10" height="155" rx="5" fill="#7A4A2A" />
            <circle cx="445" cy="272" r="42" fill="#4E9A5C" />
            <circle cx="468" cy="312" r="26" fill="#63AB6C" />

            <path d="M165 446 L170 424 H196 L201 446Z" fill="#C47A4B" />
            <path d="M183 424 C172 408 174 394 184 386 C194 396 194 410 183 424Z" fill="#3F8A4E" />
            <path d="M183 424 C196 414 206 408 214 410 C210 422 198 428 183 424Z" fill="#63AB6C" />

            <rect x="214" y="426" width="17" height="22" rx="4" fill="#3C5E8C" />
            <rect x="239" y="426" width="17" height="22" rx="4" fill="#3C5E8C" />
            <path d="M206 448 L211 356 Q235 340 259 356 L264 448Z" fill="#D5553F" />
            <ellipse cx="235" cy="314" rx="27" ry="31" fill="#2A2330" />
            <circle cx="235" cy="320" r="22" fill="#E9A878" />
            <path d="M212 318 Q214 290 236 290 Q258 290 258 318 Q248 304 236 304 Q222 304 212 318Z" fill="#2A2330" />
            <path d="M228 328 Q235 333 242 328" stroke="#8A4B2D" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M258 372 L292 390" stroke="#E9A878" strokeWidth="9" strokeLinecap="round" />
            <rect x="288" y="376" width="34" height="26" rx="5" fill="#4A7FB0" />
            <path d="M322 384 L348 396" stroke="#4A7FB0" strokeWidth="6" strokeLinecap="round" />
            <path d="M292 376 Q305 360 318 376" stroke="#4A7FB0" strokeWidth="4" fill="none" />
            <circle cx="354" cy="408" r="3" fill="#8EC5E8" />
            <circle cx="358" cy="420" r="3" fill="#8EC5E8" />

            <rect x="326" y="430" width="11" height="18" rx="3" fill="#3C5E8C" />
            <rect x="343" y="430" width="11" height="18" rx="3" fill="#3C5E8C" />
            <rect x="322" y="392" width="36" height="46" rx="14" fill="#fff" />
            <circle cx="340" cy="376" r="17" fill="#8A5A3C" />
            <ellipse cx="340" cy="366" rx="30" ry="7" fill="#D9A25B" />
            <path d="M322 365 Q324 344 340 344 Q356 344 358 365Z" fill="#D9A25B" />

            <g transform="translate(130 190)"><g className="auth-leaf auth-leaf-1"><path d="M0 0 C8 -10 20 -8 24 0 C16 8 6 8 0 0Z" fill="#63AB6C" /></g></g>
            <g transform="translate(380 250)"><g className="auth-leaf auth-leaf-2"><path d="M0 0 C8 -10 20 -8 24 0 C16 8 6 8 0 0Z" fill="#F2B52A" /></g></g>
            <g transform="translate(300 300)"><g className="auth-leaf auth-leaf-3"><path d="M0 0 C6 -8 15 -6 18 0 C12 6 4 6 0 0Z" fill="#4E9A5C" /></g></g>
          </svg>

          <div className="auth-art-card">
            <span className="auth-badge">
              <Leaf size={12} />
              rooted.BD community
            </span>
            <h2>{artTitle}</h2>
            <p>{artText}</p>
            <div className="auth-art-actions">
              <Link href={artHref} className="auth-art-cta">
                {artCta}
                <ArrowRight size={16} />
              </Link>
              <Link href="/" className="auth-art-cta auth-art-cta--ghost">
                <ArrowLeft size={16} />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}