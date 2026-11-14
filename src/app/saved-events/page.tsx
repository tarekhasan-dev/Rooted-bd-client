"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./saved-events.css";
import { getSavedEvents, removeSavedEvent } from "@/services/savedEventApi";
import type { SavedEvent } from "@/types/saved-event";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--se-font-heading",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--se-font-body",
  display: "swap",
});

type StatusFilter = "all" | "upcoming" | "past" | "open";
type SortKey = "date" | "saved" | "name";

const DAY = 86_400_000;
const REMIND_WINDOW = 30 * DAY;

const PALETTE: Record<string, [string, string]> = {
  "Community Tree Plantation": ["#d6edc0", "#5aa468"],
  "Tree Care & Maintenance": ["#cfe8f2", "#3f8f9b"],
  "School & Campus Plantation": ["#f7e6b8", "#c9893a"],
  "Tree Plantation Awareness": ["#e3f0cf", "#4c9a5f"],
};
const FALLBACK: [string, string] = ["#d6edc0", "#5aa468"];

const ms = (v?: string | null) => (v ? new Date(v).getTime() : NaN);
const pad = (n: number) => String(n).padStart(2, "0");
const fullDate = (v: string) =>
  new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const monthShort = (v: string) => new Date(v).toLocaleString("en", { month: "short" });

const isUpcoming = (e: SavedEvent, now: number) => ms(e.date) > now;
// countdown target: registration deadline if the event has one, otherwise the event start
const remindAt = (e: SavedEvent) => ms(e.registrationDeadline ?? e.date);
const isOpen = (e: SavedEvent, now: number) =>
  isUpcoming(e, now) && (!e.registrationDeadline || ms(e.registrationDeadline) > now);

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

function Art({ category }: { category: string }) {
  const [bg, tree] = PALETTE[category] ?? FALLBACK;
  return (
    <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="300" height="170" fill={bg} />
      <circle cx="240" cy="42" r="24" fill="#f6d36b" />
      <path d="M0 120 Q90 85 180 115 T300 105 V170 H0Z" fill="#fff" opacity=".45" />
      <path d="M0 140 Q150 112 300 138 V170 H0Z" fill="#7a4a2a" />
      <rect x="70" y="80" width="6" height="62" fill="#7a4a2a" />
      <circle cx="73" cy="72" r="26" fill={tree} />
      <rect x="150" y="100" width="5" height="40" fill="#7a4a2a" />
      <circle cx="152" cy="94" r="17" fill={tree} opacity=".85" />
    </svg>
  );
}

/* ---------- Coming up soon (live countdown) ---------- */
function Reminder({ event }: { event: SavedEvent }) {
  const now = useNow(1000);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    setGrown(false);
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setGrown(true));
    });
    return () => cancelAnimationFrame(id);
  }, [event.id]);

  const hasDeadline = Boolean(event.registrationDeadline);
  const left = Math.max(0, remindAt(event) - now);
  if (left === 0) return null;

  const d = Math.floor(left / DAY);
  const h = Math.floor((left % DAY) / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  const progress = Math.min(97, Math.max(3, (1 - left / REMIND_WINDOW) * 100));

  return (
    <section className="se-remind" aria-live="polite">
      <div>
        <span className="se-tag"><i className="se-dot" />Coming up soon</span>
        <h2>Your saved event is approaching!</h2>
        <p className="se-remind-title">{event.title}</p>
        <div className="se-dates">
          {hasDeadline && (
            <div className="se-dt se-dt-deadline">
              <span>Register by</span>
              <b>{pad(new Date(event.registrationDeadline!).getDate())}</b>
              <small>{monthShort(event.registrationDeadline!)}</small>
            </div>
          )}
          <div className="se-dt">
            <span>Event day</span>
            <b>{pad(new Date(event.date).getDate())}</b>
            <small>{monthShort(event.date)} {new Date(event.date).getFullYear()}</small>
          </div>
        </div>
      </div>

      <div className="se-remind-right">
        <p className="se-label">{hasDeadline ? "Time left to register" : "Time until the event starts"}</p>
        <div className="se-count">
          <div><b>{pad(d)}</b><span>Days</span></div>
          <div><b>{pad(h)}</b><span>Hours</span></div>
          <div><b>{pad(m)}</b><span>Minutes</span></div>
          <div><b>{pad(s)}</b><span>Seconds</span></div>
        </div>
        <div className="se-grow" aria-hidden="true">
          <div className="se-track">
            <div className="se-fill" style={{ width: grown ? `${progress}%` : "0%" }} />
            <span className="se-sprout" style={{ left: grown ? `${progress}%` : "0%" }}>
              <span>🌱</span>
            </span>
          </div>
          <div className="se-grow-labels"><span>30 days out</span><span>{hasDeadline ? "Deadline" : "Event day"}</span></div>
        </div>
        <Link className="se-btn se-btn-sun" href={`/events/${event.id}`}>{hasDeadline ? "Complete registration" : "View event"}</Link>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function SavedEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [removing, setRemoving] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [intro, setIntro] = useState(true);
  const [barsOn, setBarsOn] = useState(false);

  useEffect(() => {
    getSavedEvents()
      .then(setEvents)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // card stagger plays only once on first load
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setIntro(false), 1200);
    return () => clearTimeout(t);
  }, [loading]);

  const now = Date.now();
  const upcomingCount = events.filter((e) => isUpcoming(e, now)).length;
  const categories = useMemo(() => [...new Set(events.map((e) => e.category))], [events]);

  const visible = useMemo(() => {
    const t = Date.now();
    const needle = q.trim().toLowerCase();
    return events
      .filter((e) => {
        if (status === "upcoming" && !isUpcoming(e, t)) return false;
        if (status === "past" && isUpcoming(e, t)) return false;
        if (status === "open" && !isOpen(e, t)) return false;
        if (cat !== "all" && e.category !== cat) return false;
        return !needle || `${e.title} ${e.category} ${e.location}`.toLowerCase().includes(needle);
      })
      .sort((a, b) =>
        sort === "name"
          ? a.title.localeCompare(b.title)
          : sort === "saved"
          ? ms(b.savedAt) - ms(a.savedAt)
          : Math.abs(ms(a.date) - t) - Math.abs(ms(b.date) - t)
      );
  }, [events, status, cat, q, sort]);

  // nearest saved event whose deadline (or start date) is within the next 30 days
  const remindEvent = useMemo(() => {
    const t = Date.now();
    return events
      .filter((e) => isOpen(e, t) && remindAt(e) - t < REMIND_WINDOW)
      .sort((a, b) => remindAt(a) - remindAt(b))[0];
  }, [events]);

  const interests = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((e) => (map[e.category] = (map[e.category] ?? 0) + 1));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [events]);
  const showInsights = events.length >= 3;

  useEffect(() => {
    if (!showInsights) return;
    setBarsOn(false);
    const t = setTimeout(() => setBarsOn(true), 200);
    return () => clearTimeout(t);
  }, [showInsights, interests.length]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function remove(id: string) {
    setRemoving(id);
    setTimeout(async () => {
      const backup = events;
      setEvents((list) => list.filter((e) => e.id !== id));
      setRemoving(null);
      try {
        await removeSavedEvent(id);
        flash("Removed from saved events");
      } catch {
        setEvents(backup);
        flash("Could not remove the event. Try again.");
      }
    }, 280);
  }

  return (
    <main className={`se-page ${fraunces.variable} ${jakarta.variable}`}>
      <div className="se-wrap">
        {/* Back link */}
        <Link href="/events" className="se-back">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          All events
        </Link>

        {/* Hero */}
        <section className="se-hero">
          <div className="se-hero-text">
            <span className="se-pill">Your personal collection</span>
            <h1>Your next good thing.</h1>
            <p>Small plans, meaningful change. Every event you save is a chance to plant, teach or care for something that grows.</p>
            <div className="se-stats">
              <div className="se-stat"><strong>{events.length}</strong><span>Saved events</span></div>
              <div className="se-stat"><strong>{pad(upcomingCount)}</strong><span>Upcoming</span></div>
              <div className="se-stat"><strong>{pad(events.length - upcomingCount)}</strong><span>Past</span></div>
            </div>
          </div>
          <div className="se-hero-art" aria-hidden="true">
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              <g className="se-sun"><circle cx="300" cy="70" r="38" fill="#f6d36b" /><circle cx="300" cy="70" r="54" fill="#f6d36b" opacity=".3" /></g>
              <path d="M0 200 Q120 150 240 195 T400 180 V300 H0Z" fill="#b9dca0" />
              <path d="M0 240 Q150 200 400 235 V300 H0Z" fill="#7a4a2a" />
              <rect x="70" y="120" width="8" height="90" fill="#7a4a2a" /><circle cx="74" cy="110" r="34" fill="#5aa468" /><circle cx="96" cy="130" r="20" fill="#7fbd84" />
              <rect x="320" y="150" width="7" height="70" fill="#7a4a2a" /><circle cx="323" cy="140" r="26" fill="#4c9a5f" />
              <rect x="190" y="205" width="5" height="34" fill="#4c9a5f" /><circle cx="192" cy="200" r="16" fill="#6cbf7a" />
            </svg>
          </div>
        </section>

        {remindEvent && <Reminder event={remindEvent} />}

        {/* Collection */}
        <div className="se-head">
          <div>
            <h2>Your collection</h2>
            <p>{loading ? "Loading your events…" : `${visible.length} of ${events.length} saved`}</p>
          </div>
        </div>

        <div className="se-tools">
          <label className="se-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by event name, place or category" aria-label="Search saved events" />
          </label>
          <div className="se-chips">
            {([["all", "All"], ["upcoming", "Upcoming"], ["past", "Past"], ["open", "Registration open"]] as [StatusFilter, string][]).map(([v, label]) => (
              <button key={v} className="se-chip" aria-pressed={status === v} onClick={() => setStatus(v)}>{label}</button>
            ))}
          </div>
          <select className="se-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort events">
            <option value="date">Soonest first</option>
            <option value="saved">Recently saved</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {categories.length > 1 && (
          <div className="se-chips se-cats">
            <button className="se-chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All categories</button>
            {categories.map((c) => (
              <button key={c} className="se-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        )}

        {error && <div className="se-empty" role="alert"><h3>We couldn’t load your events.</h3><p>{error}</p></div>}

        {loading ? (
          <div className="se-grid"><div className="se-skel" /><div className="se-skel" /><div className="se-skel" /></div>
        ) : (
          <div className="se-grid">
            {visible.map((e, i) => {
              const up = isUpcoming(e, now);
              const open = isOpen(e, now);
              const [btnClass, label, cta] = !up
                ? ["se-btn-ghost", "Past event", "View recap"]
                : open
                ? ["", "Registration open", "View event"]
                : ["se-btn-sun", "Registration closed", "View details"];
              return (
                <article
                  key={e.id}
                  className={`se-card${intro ? " se-in" : ""}${removing === e.id ? " se-out" : ""}`}
                  style={{ ["--i" as string]: i }}
                  onClick={() => router.push(`/events/${e.id}`)}
                >
                  <div className="se-art">
                    {e.image ? <img src={e.image} alt="" loading="lazy" /> : <Art category={e.category} />}
                    <div className="se-date"><b>{pad(new Date(e.date).getDate())}</b><span>{monthShort(e.date)}</span></div>
                    <button
                      className="se-bm"
                      aria-label={`Remove ${e.title} from saved events`}
                      onClick={(ev) => { ev.stopPropagation(); remove(e.id); }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" /></svg>
                    </button>
                  </div>
                  <div className="se-body">
                    <span className="se-cat">{e.category}</span>
                    <h3>{e.title}</h3>
                    <div className="se-meta"><span>{fullDate(e.date)}</span><span>{e.location}</span></div>
                    <span className={`se-status${up ? "" : " se-past"}`}>{label}</span>
                    <Link className={`se-btn ${btnClass}`} href={`/events/${e.id}`} onClick={(ev) => ev.stopPropagation()}>{cta}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty states */}
        {!loading && !error && visible.length === 0 && (
          <div className="se-empty">
            <svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 70 L60 80 L110 70 V30 L60 40 L10 30Z" fill="#e6f2d9" stroke="#1b4d3e" strokeWidth="3" strokeLinejoin="round" /><path d="M60 40V80" stroke="#1b4d3e" strokeWidth="3" /><path d="M60 40 Q60 10 90 8 Q90 34 60 40Z" fill="#5aa468" /></svg>
            <h3>{events.length === 0 ? "Your story starts with a save." : "No events match your search."}</h3>
            <p>{events.length === 0 ? "You haven’t saved any events yet. Find one that matters to you and keep it close." : "Try a different word, or clear the filters above."}</p>
            <Link className="se-btn" href="/events">Explore events</Link>
          </div>
        )}

        {/* Interests */}
        {showInsights && (
          <section className="se-ins">
            <h2>Your interests</h2>
            <p>Based on the events you saved</p>
            {interests.map(([name, count]) => (
              <div className="se-bar" key={name}>
                <div><span>{name}</span><span>{count} event{count > 1 ? "s" : ""}</span></div>
                <div className="se-bar-track"><div className="se-bar-fill" style={{ width: barsOn ? `${(count / events.length) * 100}%` : "0%" }} /></div>
              </div>
            ))}
          </section>
        )}

        {/* Quick actions */}
        <section className="se-quick">
          <Link className="se-q" href="/events"><div><strong>Explore events</strong><span>Find new ways to help</span></div><i>→</i></Link>
          <Link className="se-q" href="/my-activity"><div><strong>My activity</strong><span>Review events you joined</span></div><i>→</i></Link>
        </section>
      </div>

      <div className={`se-toast${toast ? " se-toast-on" : ""}`} role="status">{toast}</div>
    </main>
  );
}