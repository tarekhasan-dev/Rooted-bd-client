
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Eye,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { useLang } from "@/components/LanguageProvider";
import {
  getMyEvents,
  deleteEvent,
  type MyEventApiItem,
} from "@/services/eventApi";
import type { MyEvent } from "@/lib/my-events-store";
import "./my-events.css";

type Filter = "all" | "pending" | "published" | "draft" | "ended";
type Shown = Exclude<Filter, "all">;

const bn = {
  home: "হোম",
  page: "আমার ইভেন্ট",
  chip: "আপনার কমিউনিটি যাত্রা",
  title: "আপনার ইভেন্ট।",
  title2: "আপনার প্রভাব।",
  lead: "আপনার উদ্যোগগুলো সামলান আর প্রতিটি বৃক্ষরোপণের অগ্রগতি দেখুন।",
  create: "নতুন ইভেন্ট তৈরি করুন",
  total: "মোট ইভেন্ট",
  upcoming: "আসন্ন",
  ended: "শেষ হয়েছে",
  people: "অংশগ্রহণকারী",
  tabs: {
    all: "সব",
    pending: "অপেক্ষমাণ",
    published: "প্রকাশিত",
    draft: "খসড়া",
    ended: "শেষ",
  },
  statusLabel: {
    pending: "রিভিউয়ের অপেক্ষায়",
    published: "প্রকাশিত",
    draft: "খসড়া",
    ended: "শেষ হয়েছে",
  },
  search: "আপনার ইভেন্ট খুঁজুন",
  free: "বিনামূল্যে",
  joined: "জন যোগ দিয়েছেন",
  view: "দেখুন",
  awaiting: "অনুমোদনের অপেক্ষায়",
  finish: "প্রকাশ করতে ফর্ম খুলুন",
  remove: "মুছুন",
  emptyT: "আপনার প্রথম ইভেন্ট তৈরি করুন",
  emptyP: "একটি উদ্যোগ শুরু করুন আর আপনার কমিউনিটিকে একত্র করুন।",
  noMatch: "এই ফিল্টারে কোনো ইভেন্ট নেই।",
  confirmT: "ইভেন্টটি মুছবেন?",
  confirmP: "মুছে ফেললে এটা আর ফিরিয়ে আনা যাবে না।",
  cancel: "বাতিল",
  confirm: "মুছুন",
  ctaT: "প্রতিটি পদক্ষেপ গুরুত্বপূর্ণ।",
  ctaP: "আপনার পরের উদ্যোগ একটি পুরো কমিউনিটিকে অনুপ্রাণিত করতে পারে।",
  untitled: "নামহীন ইভেন্ট",
  categories: {
    "Community Tree Plantation": "কমিউনিটি বৃক্ষরোপণ",
    "Tree Care & Maintenance": "গাছের যত্ন ও পরিচর্যা",
    "School & Campus Plantation": "স্কুল ও ক্যাম্পাসে বৃক্ষরোপণ",
    "Tree Plantation Awareness": "বৃক্ষরোপণ সচেতনতা",
  } as Record<string, string>,
  currency: "৳",
};

const en: typeof bn = {
  home: "Home",
  page: "My events",
  chip: "Your community journey",
  title: "Your events.",
  title2: "Your impact.",
  lead: "Manage your initiatives and track every plantation you organize.",
  create: "Create new event",
  total: "Total events",
  upcoming: "Upcoming",
  ended: "Ended",
  people: "Participants",
  tabs: {
    all: "All",
    pending: "Pending",
    published: "Published",
    draft: "Draft",
    ended: "Ended",
  },
  statusLabel: {
    pending: "Pending review",
    published: "Published",
    draft: "Draft",
    ended: "Ended",
  },
  search: "Search your events",
  free: "Free",
  joined: "joined",
  view: "View",
  awaiting: "Awaiting approval",
  finish: "Open the form to publish",
  remove: "Delete",
  emptyT: "Create your first event",
  emptyP: "Start an initiative and bring your community together.",
  noMatch: "No events match this filter.",
  confirmT: "Delete this event?",
  confirmP: "This can't be undone.",
  cancel: "Cancel",
  confirm: "Delete",
  ctaT: "Every action matters.",
  ctaP: "Your next initiative could inspire an entire community.",
  untitled: "Untitled event",
  categories: {
    "Community Tree Plantation": "Community Tree Plantation",
    "Tree Care & Maintenance": "Tree Care & Maintenance",
    "School & Campus Plantation": "School & Campus Plantation",
    "Tree Plantation Awareness": "Tree Plantation Awareness",
  },
  currency: "BDT",
};

const TX = { bn, en };

function todayString() {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// Backend API data -> Existing MyEvent UI format
function mapApiEvent(event: MyEventApiItem): MyEvent {
  const createdAt = new Date(event.createdAt).getTime();

  return {
    id: event._id,
    title: event.title,
    category: event.eventType,
    description: event.description,
    date: event.eventDate?.slice(0, 10) ?? "",
    startTime: "",
    endTime: "",
    location: event.location,
    maxParticipants: event.capacity ?? 0,
    joined: 0,
    feeType: "free",
    feeAmount: 0,
    items: event.bringItems ?? [],
    status: event.status,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
  };
}

function shownStatus(event: MyEvent, today: string): Shown {
  if (event.status === "published" && event.date && event.date < today) {
    return "ended";
  }

  return event.status;
}

function useCountUp(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 800;

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);

      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));

      if (p < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

function Stat({
  label,
  value,
  locale,
}: {
  label: string;
  value: number;
  locale: string;
}) {
  const shown = useCountUp(value);

  return (
    <div className="mye-stat">
      <small>{label}</small>
      <b className="mye-display">{shown.toLocaleString(locale)}</b>
    </div>
  );
}

function MiniLandscape() {
  return (
    <svg
      className="mye-mini"
      viewBox="0 0 240 90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="240" height="90" fill="#d8ebb4" />
      <circle cx="196" cy="24" r="14" fill="#f6c344" />
      <path d="M0 62 Q70 40 140 58 T240 54 V90 H0Z" fill="#a9cf74" />
      <path d="M0 76 Q80 62 160 74 T240 70 V90 H0Z" fill="#7fb25a" />
      <rect x="52" y="48" width="4" height="24" fill="#6b4a2b" />
      <circle cx="54" cy="42" r="14" fill="#59ae6a" />
      <rect x="112" y="56" width="3" height="16" fill="#6b4a2b" />
      <circle cx="113" cy="51" r="10" fill="#4f9d5d" />
    </svg>
  );
}

const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.07 },
});

export default function MyEventsPage() {
  const { lang } = useLang();
  const tx = lang === "bn" ? TX.bn : TX.en;
  const locale = lang === "bn" ? "bn-BD" : "en-US";

  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");
  const [now, setNow] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<MyEvent | null>(null);

  // Load events from backend API
  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      setToday(todayString());
      setNow(Date.now());

      try {
        const data = await getMyEvents();

        if (!cancelled) {
          setEvents(data.map(mapApiEvent));
        }
      } catch (error) {
        console.error("Failed to load my events:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const withStatus = useMemo(
    () => events.map((e) => ({ e, s: shownStatus(e, today) })),
    [events, today]
  );

  const counts = useMemo(() => {
    const c = {
      all: withStatus.length,
      pending: 0,
      published: 0,
      draft: 0,
      ended: 0,
    };

    withStatus.forEach(({ s }) => {
      c[s] += 1;
    });

    return c;
  }, [withStatus]);

  const upcoming = counts.pending + counts.published;

  const people = events.reduce((sum, e) => sum + e.joined, 0);

  const visible = withStatus.filter(({ e, s }) => {
    if (filter !== "all" && s !== filter) return false;

    const q = query.trim().toLowerCase();

    if (!q) return true;

    return `${e.title} ${e.location}`.toLowerCase().includes(q);
  });

  // Delete event from backend
  const confirmDelete = async () => {
    if (!toDelete) return;

    try {
      await deleteEvent(toDelete.id);

      setEvents((list) =>
        list.filter((e) => e.id !== toDelete.id)
      );

      setToDelete(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const fmtDate = (value: string) =>
    value
      ? new Date(`${value}T00:00:00`).toLocaleDateString(locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  const tabs: Filter[] = [
    "all",
    "pending",
    "published",
    "draft",
    "ended",
  ];

  return (
    <MotionConfig reducedMotion="user">
      <main className="mye">
        <div className="mye-wrap">
          <nav className="mye-crumb" aria-label="Breadcrumb">
            <Link href="/">{tx.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{tx.page}</span>
          </nav>

          {/* HERO */}
          <section className="mye-hero">
            <div className="mye-hero-l">
              <motion.div className="mye-chips" {...rise(0)}>
                <span className="mye-chip">{tx.chip}</span>
              </motion.div>

              <motion.h1 className="mye-title mye-display" {...rise(1)}>
                {tx.title}
                <br />
                <span>{tx.title2}</span>
              </motion.h1>

              <motion.p className="mye-lead" {...rise(2)}>
                {tx.lead}
              </motion.p>

              <motion.div {...rise(3)}>
                <Link href="/create-event" className="mye-gold-btn">
                  <Plus size={16} />
                  {tx.create}
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="mye-art"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                className="mye-svg"
                viewBox="0 0 480 360"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="myeSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#eaf5cc" />
                    <stop offset="1" stopColor="#cfe6a6" />
                  </linearGradient>
                </defs>

                <rect width="480" height="360" fill="url(#myeSky)" />

                <g>
                  <circle
                    className="mye-glow"
                    cx="388"
                    cy="72"
                    r="66"
                    fill="#f6c344"
                    opacity=".28"
                  />
                  <circle cx="388" cy="72" r="40" fill="#f6c344" />
                </g>

                <path
                  d="M0 250 Q140 190 280 240 T480 225 V360 H0Z"
                  fill="#a9cf74"
                />

                <path
                  d="M0 292 Q160 242 320 286 T480 270 V360 H0Z"
                  fill="#7fb25a"
                />

                <g className="mye-sway">
                  <rect x="96" y="216" width="6" height="70" fill="#6b4a2b" />
                  <circle cx="99" cy="202" r="32" fill="#59ae6a" />
                </g>

                <g
                  className="mye-sway"
                  style={{ animationDelay: "-1.1s" }}
                >
                  <rect x="205" y="236" width="5" height="52" fill="#6b4a2b" />
                  <circle cx="207" cy="224" r="24" fill="#4f9d5d" />
                </g>

                <g
                  className="mye-sway"
                  style={{ animationDelay: "-2.2s" }}
                >
                  <rect x="318" y="212" width="6" height="74" fill="#6b4a2b" />
                  <circle cx="321" cy="196" r="30" fill="#59ae6a" />
                </g>
              </svg>
            </motion.div>
          </section>

          {/* STATS */}
          <section className="mye-stats">
            <Stat label={tx.total} value={counts.all} locale={locale} />
            <Stat label={tx.upcoming} value={upcoming} locale={locale} />
            <Stat label={tx.ended} value={counts.ended} locale={locale} />
            <Stat label={tx.people} value={people} locale={locale} />
          </section>

          {/* LIST */}
          <section className="mye-panel">
            <div className="mye-toolbar">
              <div className="mye-tabs" role="tablist">
                {tabs.map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={filter === key}
                    className={filter === key ? "is-on" : ""}
                    onClick={() => setFilter(key)}
                  >
                    {tx.tabs[key]}{" "}
                    <span>{counts[key].toLocaleString(locale)}</span>
                  </button>
                ))}
              </div>

              <label className="mye-search">
                <Search size={15} />
                <input
                  type="search"
                  placeholder={tx.search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>

            {loading && (
              <div className="mye-grid">
                {[0, 1].map((i) => (
                  <div key={i} className="mye-skel" />
                ))}
              </div>
            )}

            {!loading && events.length === 0 && (
              <div className="mye-empty">
                <svg
                  viewBox="0 0 120 90"
                  width="120"
                  height="90"
                  aria-hidden="true"
                >
                  <ellipse cx="60" cy="80" rx="46" ry="6" fill="#dcebc6" />

                  <g className="mye-sway">
                    <rect x="57" y="42" width="6" height="38" fill="#6b4a2b" />
                    <circle cx="60" cy="34" r="22" fill="#59ae6a" />
                  </g>
                </svg>

                <h3 className="mye-display">{tx.emptyT}</h3>
                <p>{tx.emptyP}</p>

                <Link href="/create-event" className="mye-gold-btn">
                  <Plus size={16} />
                  {tx.create}
                </Link>
              </div>
            )}

            {!loading && events.length > 0 && visible.length === 0 && (
              <p className="mye-nomatch">{tx.noMatch}</p>
            )}

            <div className="mye-grid">
              <AnimatePresence mode="popLayout">
                {visible.map(({ e, s }, index) => {
                  const isNew = now - e.createdAt < 60000;

                  const percent = e.maxParticipants
                    ? Math.min(
                        100,
                        (e.joined / e.maxParticipants) * 100
                      )
                    : 0;

                  return (
                    <motion.article
                      key={e.id}
                      layout
                      className={`mye-card${isNew ? " is-new" : ""}`}
                      data-status={s}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.06,
                      }}
                    >
                      <div className="mye-card-pic">
                        <MiniLandscape />

                        <span className={`mye-status mye-status--${s}`}>
                          {tx.statusLabel[s]}
                        </span>
                      </div>

                      <div className="mye-card-body">
                        <span className="mye-cat">
                          {tx.categories[e.category] ?? e.category}
                        </span>

                        <h3 className="mye-display">
                          {e.title || tx.untitled}
                        </h3>

                        <ul className="mye-meta">
                          <li>
                            <CalendarDays size={14} />
                            {fmtDate(e.date)}
                          </li>

                          {e.startTime && (
                            <li>
                              <Clock size={14} />
                              {e.startTime}
                              {e.endTime ? ` – ${e.endTime}` : ""}
                            </li>
                          )}

                          {e.location && (
                            <li>
                              <MapPin size={14} />
                              {e.location}
                            </li>
                          )}
                        </ul>

                        <div className="mye-capline">
                          <span>
                            <Users size={14} />
                            {e.joined.toLocaleString(locale)} /{" "}
                            {e.maxParticipants.toLocaleString(locale)}{" "}
                            {tx.joined}
                          </span>

                          <span>
                            {e.feeType === "free"
                              ? tx.free
                              : `${tx.currency} ${e.feeAmount.toLocaleString(locale)}`}
                          </span>
                        </div>

                        <div className="mye-bar">
                          <motion.i
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 0.2,
                            }}
                          />
                        </div>

                        <div className="mye-actions">
                          {s === "published" || s === "ended" ? (
                            <Link
                              href={`/events/${e.id}`}
                              className="mye-gold-btn mye-sm"
                            >
                              <Eye size={14} />
                              {tx.view}
                            </Link>
                          ) : s === "draft" ? (
                            <Link
                              href="/create-event"
                              className="mye-ghost-btn"
                            >
                              {tx.finish}
                              <ArrowRight size={14} />
                            </Link>
                          ) : (
                            <span className="mye-ghost-btn is-static">
                              {tx.awaiting}
                            </span>
                          )}

                          <button
                            type="button"
                            className="mye-del"
                            aria-label={tx.remove}
                            onClick={() => setToDelete(e)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* CTA */}
          <section className="mye-cta">
            <div>
              <h2 className="mye-display">{tx.ctaT}</h2>
              <p>{tx.ctaP}</p>
            </div>

            <Link href="/create-event" className="mye-cta-btn">
              {tx.create}
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>

        {/* Delete confirm */}
        {toDelete && (
          <div
            className="mye-backdrop"
            role="presentation"
            onClick={() => setToDelete(null)}
          >
            <div
              className="mye-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mye-del-title"
              onClick={(ev) => ev.stopPropagation()}
            >
              <h2 id="mye-del-title" className="mye-display">
                {tx.confirmT}
              </h2>

              <p>
                <b>{toDelete.title || tx.untitled}</b>
                <br />
                {tx.confirmP}
              </p>

              <div className="mye-modal-actions">
                <button
                  type="button"
                  className="mye-ghost-btn"
                  onClick={() => setToDelete(null)}
                >
                  {tx.cancel}
                </button>

                <button
                  type="button"
                  className="mye-danger-btn"
                  onClick={confirmDelete}
                >
                  {tx.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MotionConfig>
  );
}
