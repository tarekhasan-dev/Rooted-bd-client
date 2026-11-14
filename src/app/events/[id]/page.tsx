"use client";

import "@/styles/events.css";
import "@/styles/event-detail.css";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Info,
  Leaf,
  MapPin,
  RefreshCw,
  Sprout,
  User,
  Users,
} from "lucide-react";

import { MotionConfig, motion } from "motion/react";

import { useLang } from "@/components/LanguageProvider";
import SaveButton from "@/components/saved/SaveButton";
import { authClient } from "@/lib/auth-client";

import {
  getEventById,
  getMyJoinedEventIds,
  getUpcomingEvents,
  joinEvent,
  leaveEvent,
} from "@/services/eventApi";

import type { EventItem } from "@/types/event";

const CREATE_EVENT_HREF = "/create-event";
const JOIN_HREF = "/signup";
const LOGIN_HREF = "/login";

const TX = {
  bn: {
    back: "সব ইভেন্ট",
    date: "তারিখ",
    time: "সময়",
    place: "স্থান",
    host: "আয়োজক",
    going: "জন যোগ দিয়েছেন",
    nobody: "এখনো কেউ যোগ দেননি। প্রথম হোন!",
    about: "ইভেন্ট সম্পর্কে",
    aboutSub: "আয়োজকের বিবরণ",
    organizer: "আয়োজক",
    organizerSub: "এই ইভেন্টটি তৈরি করেছেন",
    joinTitle: "এসো, একসাথে গড়ি",
    joinText: "ইভেন্টে যোগ দিয়ে কমিউনিটির পাশে দাঁড়ান।",
    join: "ইভেন্টে যোগ দিন",
    loginJoin: "লগইন করে যোগ দিন",
    joined: "যোগ দেওয়া হয়েছে",
    leave: "যোগদান বাতিল করুন",
    ended: "ইভেন্ট শেষ হয়েছে",
    endedBadge: "শেষ",
    joinedMsg: "আপনি ইভেন্টে যোগ দিয়েছেন।",
    leftMsg: "যোগদান বাতিল হয়েছে।",
    failed: "কাজটি সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
    related: "আরও ইভেন্ট",
    relatedSub: "আপনার পছন্দ হতে পারে",
    nfTitle: "ইভেন্টটি পাওয়া যায়নি",
    nfText: "লিংকটি ভুল হতে পারে, অথবা ইভেন্টটি মুছে ফেলা হয়েছে।",
    errTitle: "ইভেন্ট লোড করা যায়নি",
    browse: "সব ইভেন্ট দেখুন",
  },

  en: {
    back: "All events",
    date: "Date",
    time: "Time",
    place: "Location",
    host: "Organizer",
    going: "people joined",
    nobody: "No one has joined yet. Be the first!",
    about: "About this event",
    aboutSub: "Details from the organizer",
    organizer: "Organizer",
    organizerSub: "Created this event",
    joinTitle: "Come, let's build together",
    joinText: "Join this event and stand with your community.",
    join: "Join event",
    loginJoin: "Log in to join",
    joined: "You've joined",
    leave: "Cancel my spot",
    ended: "This event has ended",
    endedBadge: "Ended",
    joinedMsg: "You've joined this event.",
    leftMsg: "Your spot has been cancelled.",
    failed: "Something went wrong. Please try again.",
    related: "More events",
    relatedSub: "You might like these",
    nfTitle: "Event not found",
    nfText: "The link may be wrong, or the event was removed.",
    errTitle: "Couldn't load the event",
    browse: "Browse all events",
  },
} as const;

type Status = "loading" | "ready" | "notfound" | "error";

// Scroll-reveal settings shared by the panels and cards
const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

// Illustration shown when the event has no cover photo
function Landscape() {
  return (
    <svg
      className="evd-svg"
      viewBox="0 0 480 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="evdSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf5cc" />
          <stop offset="1" stopColor="#cfe6a6" />
        </linearGradient>
      </defs>
      <rect width="480" height="360" fill="url(#evdSky)" />

      <circle
        className="evd-sun-glow"
        cx="388"
        cy="72"
        r="66"
        fill="#f6c344"
        opacity=".28"
      />
      <circle cx="388" cy="72" r="40" fill="#f6c344" />

      <g className="evd-cloud" opacity=".85">
        <ellipse cx="90" cy="70" rx="36" ry="12" fill="#fff" />
        <ellipse cx="116" cy="60" rx="24" ry="11" fill="#fff" />
      </g>

      <path d="M0 250 Q140 190 280 240 T480 225 V360 H0Z" fill="#a9cf74" />
      <path d="M0 292 Q160 242 320 286 T480 270 V360 H0Z" fill="#7fb25a" />

      <g className="evd-sway">
        <rect x="96" y="216" width="6" height="70" fill="#6b4a2b" />
        <circle cx="99" cy="202" r="32" fill="#59ae6a" />
      </g>
      <g className="evd-sway" style={{ animationDelay: "-1.1s" }}>
        <rect x="205" y="236" width="5" height="52" fill="#6b4a2b" />
        <circle cx="207" cy="224" r="24" fill="#4f9d5d" />
      </g>
      <g className="evd-sway" style={{ animationDelay: "-2.2s" }}>
        <rect x="318" y="212" width="6" height="74" fill="#6b4a2b" />
        <circle cx="321" cy="196" r="30" fill="#59ae6a" />
      </g>
    </svg>
  );
}

// Main Event Detail Component
function EventDetailContent() {
  const { t, lang } = useLang();

  const tx = lang === "bn" ? TX.bn : TX.en;
  const locale = lang === "bn" ? "bn-BD" : "en-US";

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(0);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [related, setRelated] = useState<EventItem[]>([]);

  // Load event details
  const loadEvent = useCallback(async () => {
    if (!id) return;

    try {
      setStatus("loading");
      setErrorMsg("");

      const data = await getEventById(id);

      setEvent(data.event);
      setCount(data.joinedCount);
      setStatus("ready");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";

      if (
        message === "Event not found!" ||
        message === "Invalid event ID!"
      ) {
        setStatus("notfound");
      } else {
        setErrorMsg(message);
        setStatus("error");
      }
    }
  }, [id]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  // Check whether the logged-in user has joined this event
  useEffect(() => {
    if (!userEmail || !id) {
      setJoined(false);
      return;
    }

    let cancelled = false;

    getMyJoinedEventIds()
      .then((ids) => {
        if (!cancelled) {
          setJoined(ids.includes(id));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [userEmail, id]);

  // Related events: same category first, then the rest
  const eventId = event?._id;
  const eventType = event?.eventType;

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;

    getUpcomingEvents()
      .then((list) => {
        if (cancelled) return;

        const others = list.filter((item) => item._id !== eventId);

        const type = String(eventType ?? "")
          .trim()
          .toLowerCase();

        const same = others.filter(
          (item) =>
            String(item.eventType ?? "")
              .trim()
              .toLowerCase() === type
        );

        const rest = others.filter((item) => !same.includes(item));

        setRelated([...same, ...rest].slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) {
          setRelated([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [eventId, eventType]);

  // Format full event date
  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return t("date_unavailable");
    }

    return date.toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format short event date
  const formatShortDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return t("date_unavailable");
    }

    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show the time only when the event date really has one
  const formatTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    if (date.getHours() === 0 && date.getMinutes() === 0) {
      return "";
    }

    return date.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Join or leave event
  const handleJoin = async () => {
    if (!event || busy) return;

    if (!userEmail) {
      router.push(LOGIN_HREF);
      return;
    }

    try {
      setBusy(true);
      setNotice("");

      if (joined) {
        await leaveEvent(event._id);

        setJoined(false);
        setCount((c) => Math.max(0, c - 1));
        setNotice(tx.leftMsg);
      } else {
        await joinEvent(event._id);

        setJoined(true);
        setCount((c) => c + 1);
        setNotice(tx.joinedMsg);
      }
    } catch (err) {
      setNotice(
        err instanceof Error && err.message ? err.message : tx.failed
      );
    } finally {
      setBusy(false);
    }
  };

  const isPast = event
    ? new Date(event.eventDate).getTime() < Date.now()
    : false;

  const time = event ? formatTime(event.eventDate) : "";

  const creator = event?.creatorName || t("evp_member");

  const joinLabel = isPast
    ? tx.ended
    : joined
      ? tx.joined
      : userEmail || isPending
        ? tx.join
        : tx.loginJoin;

  return (
    <MotionConfig reducedMotion="user">
      <main className="ev-page evd">
        <div className="ev-wrap">
          <Link href="/events" className="evd-back">
            <ArrowLeft size={16} />
            {tx.back}
          </Link>

          {status === "loading" && <div className="ev-skel evd-skel-hero" />}

          {status === "notfound" && (
            <div className="ev-empty">
              <span className="ev-empty-icon">
                <CalendarDays size={28} />
              </span>

              <h3>{tx.nfTitle}</h3>
              <p>{tx.nfText}</p>

              <Link href="/events" className="ev-btn ev-btn-wide">
                {tx.browse}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="ev-empty">
              <span className="ev-empty-icon">
                <RefreshCw size={26} />
              </span>

              <h3>{tx.errTitle}</h3>
              <p>{errorMsg || t("evp_load_failed")}</p>

              <button
                type="button"
                className="ev-btn ev-btn-wide"
                onClick={() => void loadEvent()}
              >
                <RefreshCw size={16} />
                {t("evp_try_again")}
              </button>
            </div>
          )}

          {status === "ready" && event && (
            <>
              <motion.section
                className="ev-hero"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="ev-hero-left">
                  <div className="evd-chips">
                    <span className="ev-pill">
                      <Leaf size={12} />
                      {event.eventType || t("type_default")}
                    </span>

                    {isPast && (
                      <span className="evd-ended">{tx.endedBadge}</span>
                    )}
                  </div>

                  <h1 className="ev-display ev-title">{event.title}</h1>

                  <ul className="evd-meta">
                    <li>
                      <span className="evd-ic">
                        <CalendarDays size={16} />
                      </span>

                      <div>
                        <small>{tx.date}</small>
                        <b>{formatDate(event.eventDate)}</b>
                      </div>
                    </li>

                    {time && (
                      <li>
                        <span className="evd-ic">
                          <Clock size={16} />
                        </span>

                        <div>
                          <small>{tx.time}</small>
                          <b>{time}</b>
                        </div>
                      </li>
                    )}

                    <li>
                      <span className="evd-ic">
                        <MapPin size={16} />
                      </span>

                      <div>
                        <small>{tx.place}</small>
                        <b>{event.location}</b>
                      </div>
                    </li>

                    <li>
                      <span className="evd-ic">
                        <User size={16} />
                      </span>

                      <div>
                        <small>{tx.host}</small>
                        <b>{creator}</b>
                      </div>
                    </li>
                  </ul>

                  <p className="evd-count" aria-live="polite">
                    <Users size={18} />

                    {count === 0 ? (
                      <span>{tx.nobody}</span>
                    ) : (
                      <span>
                        <motion.strong
                          key={count}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 18,
                          }}
                        >
                          {count.toLocaleString(locale)}
                        </motion.strong>{" "}
                        {tx.going}
                      </span>
                    )}
                  </p>
                </div>

                <div className="ev-art evd-art">
                  {event.thumbnail ? (
                    <div
                      className="evd-photo"
                      role="img"
                      aria-label={event.title}
                      style={{
                        backgroundImage: `url("${event.thumbnail}")`,
                      }}
                    />
                  ) : (
                    <div
                      className="evd-photo evd-photo--empty"
                      aria-hidden="true"
                    >
                      <Landscape />
                    </div>
                  )}

                  <div className="evd-leaves" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="ev-inset">
                    <span className="ev-pill">
                      <Leaf size={12} />
                      {t("community")}
                    </span>

                    <h2>{tx.joinTitle}</h2>
                    <p>{tx.joinText}</p>

                    {/* Join + Save: side by side */}
                    <div className="evd-actions">
                      <button
                        type="button"
                        className="evd-join"
                        data-joined={joined}
                        aria-pressed={joined}
                        disabled={isPast || busy}
                        onClick={() => void handleJoin()}
                      >
                        {joinLabel}

                        {!joined && !isPast && <ArrowRight size={16} />}
                      </button>

                      <SaveButton eventId={event._id} variant="button" />
                    </div>

                    {joined && !isPast && (
                      <button
                        type="button"
                        className="evd-leave"
                        disabled={busy}
                        onClick={() => void handleJoin()}
                      >
                        {tx.leave}
                      </button>
                    )}

                    <p className="evd-notice" role="status">
                      {notice}
                    </p>
                  </div>
                </div>
              </motion.section>

              <div className="evd-cols">
                <motion.section className="evd-panel" {...reveal}>
                  <div className="evd-panel-head">
                    <span className="evd-ic">
                      <Info size={16} />
                    </span>

                    <div>
                      <h2 className="ev-display">{tx.about}</h2>
                      <p className="evd-sub">{tx.aboutSub}</p>
                    </div>
                  </div>

                  <p className="evd-text">{event.description}</p>
                </motion.section>

                <motion.section
                  className="evd-panel"
                  {...reveal}
                  transition={{ duration: 0.45, delay: 0.08 }}
                >
                  <div className="evd-panel-head">
                    <span className="evd-ic">
                      <User size={16} />
                    </span>

                    <div>
                      <h2 className="ev-display">{tx.organizer}</h2>
                      <p className="evd-sub">{tx.organizerSub}</p>
                    </div>
                  </div>

                  <div className="evd-org">
                    <span className="evd-avatar" aria-hidden="true">
                      {creator.trim().charAt(0).toUpperCase()}
                    </span>

                    <div>
                      <b>{creator}</b>
                      <small>{t("evp_organized_by")}</small>
                    </div>
                  </div>

                  <div className="evd-place">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                </motion.section>
              </div>

              {related.length > 0 && (
                <section className="evd-related">
                  <motion.div className="evd-related-head" {...reveal}>
                    <h2 className="ev-display ev-h2">{tx.related}</h2>

                    <p className="ev-sub">{tx.relatedSub}</p>
                  </motion.div>

                  <div className="ev-grid">
                    {related.map((item, index) => (
                      <motion.article
                        key={item._id}
                        className="ev-card"
                        {...reveal}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                      >
                        <div
                          className="ev-thumb"
                          role={item.thumbnail ? "img" : undefined}
                          aria-label={item.thumbnail ? item.title : undefined}
                          style={{
                            position: "relative",
                            ...(item.thumbnail
                              ? { backgroundImage: `url("${item.thumbnail}")` }
                              : {}),
                          }}
                        >
                          {!item.thumbnail && <Sprout size={54} />}

                          <SaveButton eventId={item._id} />
                        </div>

                        <div className="ev-card-body">
                          <span className="ev-pill">
                            {item.eventType || t("type_default")}
                          </span>

                          <h3>{item.title}</h3>

                          <p className="ev-desc">{item.description}</p>

                          <ul className="ev-meta">
                            <li>
                              <CalendarDays size={15} />
                              <span>{formatShortDate(item.eventDate)}</span>
                            </li>

                            <li>
                              <MapPin size={15} />
                              <span>{item.location}</span>
                            </li>
                          </ul>

                          <Link
                            href={`/events/${item._id}`}
                            className="ev-btn"
                          >
                            {t("view_event")}
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {!isPending && !userEmail && status !== "loading" && (
            <motion.section className="ev-cta" {...reveal}>
              <div>
                <h2 className="ev-display">{t("evp_cta_title")}</h2>

                <p>{t("evp_cta_text")}</p>
              </div>

              <Link href={JOIN_HREF} className="ev-amber">
                {t("join_community")}
                <ArrowRight size={16} />
              </Link>
            </motion.section>
          )}

          {!isPending && userEmail && status === "ready" && (
            <motion.section className="ev-cta" {...reveal}>
              <div>
                <h2 className="ev-display">{t("evp_card_title")}</h2>

                <p>{t("evp_card_text")}</p>
              </div>

              <Link href={CREATE_EVENT_HREF} className="ev-amber">
                {t("host_event")}
                <ArrowRight size={16} />
              </Link>
            </motion.section>
          )}
        </div>
      </main>
    </MotionConfig>
  );
}

// Suspense boundary for useParams()
export default function EventDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <EventDetailContent />
    </Suspense>
  );
}