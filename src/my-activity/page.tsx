"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "../saved-events/saved-events.css";
import { api } from "@/lib/api";

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

/* backend GET /joins থেকে যে রকম data আসে */
type JoinRow = {
  _id: string;
  eventId: string;
  joinedAt?: string;
  eventSnapshot?: {
    title?: string;
    eventType?: string;
    thumbnail?: string;
    location?: string;
    eventDate?: string;
    creatorName?: string;
  };
};

type JoinedEvent = {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image: string | null;
  joinedAt: string;
};

type Filter = "all" | "upcoming" | "past";

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
  Number.isNaN(ms(v))
    ? "—"
    : new Date(v).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

const monthShort = (v: string) =>
  Number.isNaN(ms(v)) ? "" : new Date(v).toLocaleString("en", { month: "short" });

const dayOf = (v: string) =>
  Number.isNaN(ms(v)) ? "--" : pad(new Date(v).getDate());

const split = (left: number) => ({
  d: Math.floor(left / DAY),
  h: Math.floor((left % DAY) / 3_600_000),
  m: Math.floor((left % 3_600_000) / 60_000),
  s: Math.floor((left % 60_000) / 1000),
});

function mapRow(row: JoinRow): JoinedEvent {
  const snap = row.eventSnapshot ?? {};
  return {
    id: String(row.eventId),
    title: snap.title || "Untitled event",
    category: snap.eventType || "",
    location: snap.location || "",
    date: snap.eventDate || "",
    image: snap.thumbnail || null,
    joinedAt: row.joinedAt || "",
  };
}

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

/* ---------- বড় countdown (সবচেয়ে কাছের event) ---------- */
function Reminder({ ev, now }: { ev: JoinedEvent; now: number }) {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    setGrown(false);
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setGrown(true));
    });
    return () => cancelAnimationFrame(id);
  }, [ev.id]);

  const left = Math.max(0, ms(ev.date) - now);
  if (left === 0) return null;

  const { d, h, m, s } = split(left);
  const progress = Math.min(97, Math.max(3, (1 - left / REMIND_WINDOW) * 100));

  return (
    <section className="se-remind" aria-live="polite">
      <div>
        <span className="se-tag"><i className="se-dot" />Next up</span>
        <h2>Your next event is on its way!</h2>
        <p className="se-remind-title">{ev.title}</p>
        <div className="se-dates">
          <div className="se-dt se-dt-deadline">
            <span>Event day</span>
            <b>{dayOf(ev.date)}</b>
            <small>{monthShort(ev.date)} {new Date(ev.date).getFullYear()}</small>
          </div>
          {ev.location && (
            <div className="se-dt">
              <span>Where</span>
              <small>{ev.location}</small>
            </div>
          )}
        </div>
      </div>

      <div className="se-remind-right">
        <p className="se-label">Time until the event starts</p>
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
          <div className="se-grow-labels"><span>30 days out</span><span>Event day</span></div>
        </div>
        <Link className="se-btn se-btn-sun" href={`/events/${ev.id}`}>View event</Link>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function MyActivityPage() {
  const router = useRouter();
  const now = useNow(1000);

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    api("/joins", {}, true)
      .then((res) => {
        const rows: JoinRow[] = Array.isArray(res?.joinedEvents) ? res.joinedEvents : [];
        setEvents(rows.map(mapRow));
      })
      .catch((e: Error) => setError(e.message || "Could not load your events."))
      .finally(() => setLoading(false));
  }, []);

  // card-এর stagger animation শুধু প্রথমবার
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setIntro(false), 1200);
    return () => clearTimeout(t);
  }, [loading]);

  const isUp = (e: JoinedEvent) => ms(e.date) > now;
  const upcomingCount = events.filter(isUp).length;

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = events.filter((e) => {
      if (filter === "upcoming" && !(ms(e.date) > now)) return false;
      if (filter === "past" && ms(e.date) > now) return false;
      return !needle || `${e.title} ${e.category} ${e.location}`.toLowerCase().includes(needle);
    });
    // আসন্ন event আগে (কাছেরটা সবার উপরে), শেষ হওয়াগুলো নিচে
    return list.sort((a, b) => {
      const ua = ms(a.date) > now;
      const ub = ms(b.date) > now;
      if (ua && ub) return ms(a.date) - ms(b.date);
      if (ua) return -1;
      if (ub) return 1;
      return ms(b.date) - ms(a.date);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, filter, q, Math.floor(now / 60_000)]);

  const nextEvent = useMemo(
    () =>
      events
        .filter((e) => ms(e.date) > now)
        .sort((a, b) => ms(a.date) - ms(b.date))[0],
    [events, now]
  );

  return (
    <main className={`se-page ${fraunces.variable} ${jakarta.variable}`}>
      <div className="se-wrap">
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
            <span className="se-pill">Your activity</span>
            <h1>Show up. Make it grow.</h1>
            <p>Every event you join is a promise to your community. See how close each one is.</p>
            <div className="se-stats">
              <div className="se-stat"><strong>{events.length}</strong><span>Joined events</span></div>
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

        {nextEvent && <Reminder ev={nextEvent} now={now} />}

        {/* Collection */}
        <div className="se-head">
          <div>
            <h2>Events you joined</h2>
            <p>{loading ? "Loading your events…" : `${visible.length} of ${events.length} joined`}</p>
          </div>
        </div>

        <div className="se-tools">
          <label className="se-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by event name, place or category"
              aria-label="Search joined events"
            />
          </label>
          <div className="se-chips">
            {([["all", "All"], ["upcoming", "Upcoming"], ["past", "Past"]] as [Filter, string][]).map(([v, label]) => (
              <button key={v} className="se-chip" aria-pressed={filter === v} onClick={() => setFilter(v)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="se-empty" role="alert">
            <h3>We couldn’t load your events.</h3>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="se-grid"><div className="se-skel" /><div className="se-skel" /><div className="se-skel" /></div>
        ) : (
          <div className="se-grid">
            {visible.map((e, i) => {
              const up = ms(e.date) > now;
              const { d, h, m, s } = split(Math.max(0, ms(e.date) - now));
              return (
                <article
                  key={e.id}
                  className={`se-card${intro ? " se-in" : ""}`}
                  style={{ ["--i" as string]: i }}
                  onClick={() => router.push(`/events/${e.id}`)}
                >
                  <div className="se-art">
                    {e.image ? <img src={e.image} alt="" loading="lazy" /> : <Art category={e.category} />}
                    <div className="se-date"><b>{dayOf(e.date)}</b><span>{monthShort(e.date)}</span></div>
                  </div>
                  <div className="se-body">
                    {e.category && <span className="se-cat">{e.category}</span>}
                    <h3>{e.title}</h3>
                    <div className="se-meta">
                      <span>{fullDate(e.date)}</span>
                      {e.location && <span>{e.location}</span>}
                    </div>

                    {up ? (
                      <>
                        <span className="se-cd-label">Starts in</span>
                        <div className="se-cd">
                          <div><b>{pad(d)}</b><span>Days</span></div>
                          <div><b>{pad(h)}</b><span>Hrs</span></div>
                          <div><b>{pad(m)}</b><span>Min</span></div>
                          <div><b>{pad(s)}</b><span>Sec</span></div>
                        </div>
                      </>
                    ) : (
                      <span className="se-status se-past">Past event</span>
                    )}

                    <Link
                      className={`se-btn ${up ? "" : "se-btn-ghost"}`}
                      href={`/events/${e.id}`}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      {up ? "View event" : "View recap"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && visible.length === 0 && (
          <div className="se-empty">
            <svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 70 L60 80 L110 70 V30 L60 40 L10 30Z" fill="#e6f2d9" stroke="#1b4d3e" strokeWidth="3" strokeLinejoin="round" /><path d="M60 40V80" stroke="#1b4d3e" strokeWidth="3" /><path d="M60 40 Q60 10 90 8 Q90 34 60 40Z" fill="#5aa468" /></svg>
            <h3>{events.length === 0 ? "Nothing joined yet." : "No events match your search."}</h3>
            <p>
              {events.length === 0
                ? "Join an event and it will show up here with a live countdown."
                : "Try a different word, or clear the filters above."}
            </p>
            <Link className="se-btn" href="/events">Explore events</Link>
          </div>
        )}

        {/* Quick actions */}
        <section className="se-quick">
          <Link className="se-q" href="/events"><div><strong>Explore events</strong><span>Find new ways to help</span></div><i>→</i></Link>
          <Link className="se-q" href="/saved-events"><div><strong>Saved events</strong><span>Events you bookmarked</span></div><i>→</i></Link>
        </section>
      </div>
    </main>
  );
}