"use client";

import { useEffect, useState } from "react";
import { getSavedIds, removeSavedEvent, saveEvent } from "@/services/savedEventApi";
import { useLang } from "@/components/LanguageProvider";

/* সব card মিলে একবারই saved id আনে, বারবার API ডাকে না */
let cache: Set<string> | null = null;
let cachedAt = 0;
let pending: Promise<Set<string>> | null = null;

async function loadIds(): Promise<Set<string>> {
  if (cache && Date.now() - cachedAt < 5000) return cache;
  if (!pending) {
    pending = getSavedIds()
      .then((ids) => {
        cache = new Set(ids);
        cachedAt = Date.now();
        pending = null;
        return cache;
      })
      .catch((err) => {
        pending = null;
        throw err;
      });
  }
  return pending;
}

type Props = {
  eventId: string;
  /** "icon" = ছবির কোণায় গোল bookmark, "button" = লেখাসহ বাটন */
  variant?: "icon" | "button";
};

export default function SaveButton({ eventId, variant = "icon" }: Props) {
  const { lang } = useLang();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadIds()
      .then((s) => setSaved(s.has(eventId)))
      .catch(() => {});
  }, [eventId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    setBusy(true);
    const next = !saved;
    setSaved(next); // সঙ্গে সঙ্গে রং বদলায়

    try {
      await (next ? saveEvent(eventId) : removeSavedEvent(eventId));
      if (cache) {
        if (next) cache.add(eventId);
        else cache.delete(eventId);
      }
    } catch {
      setSaved(!next); // ব্যর্থ হলে আগের অবস্থায় ফিরবে
    } finally {
      setBusy(false);
    }
  }

  const renderIcon = (size: number) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
    </svg>
  );

  if (variant === "button") {
    const label =
      lang === "bn"
        ? saved
          ? "সেভ করা হয়েছে"
          : "ইভেন্ট সেভ করুন"
        : saved
          ? "Saved"
          : "Save event";

    return (
      <button
        type="button"
        className="evd-save"
        onClick={toggle}
        disabled={busy}
        aria-pressed={saved}
      >
        {renderIcon(18)}
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved events" : "Save this event"}
      title={saved ? "Saved" : "Save this event"}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 5,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: 0,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        background: saved ? "#0e7a6d" : "#fff",
        color: saved ? "#fff" : "#0e7a6d",
        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
      }}
    >
      {renderIcon(20)}
    </button>
  );
}