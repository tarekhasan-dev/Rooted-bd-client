"use client";

import "@/styles/events.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import SaveButton from "@/components/saved/SaveButton";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Leaf,
  MapPin,
  RefreshCw,
  Search,
  Sprout,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";

import { api } from "@/lib/api";
import { useLang } from "@/components/LanguageProvider";

interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName: string;
  creatorEmail: string;
}

const CREATE_EVENT_HREF = "/create-event";
const JOIN_HREF = "/signup";
const SAVED_EVENTS_HREF = "/saved-events";
const RESULTS_ID = "ev-results";

function Illustration() {
  return (
    <svg
      viewBox="0 0 440 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="440" height="560" fill="#e3f2c8" />
      <circle cx="345" cy="88" r="92" fill="#fbe08a" opacity=".45" />
      <circle cx="345" cy="88" r="44" fill="#fbd56b" />
      <ellipse cx="92" cy="118" rx="60" ry="14" fill="#fff" opacity=".85" />
      <ellipse cx="150" cy="104" rx="34" ry="10" fill="#fff" opacity=".85" />
      <path d="M0 300 Q120 244 240 290 T440 274 V560 H0Z" fill="#c3e1a6" />
      <path d="M0 340 Q150 292 300 334 T440 320 V560 H0Z" fill="#a8d492" />
      <rect x="44" y="150" width="10" height="230" fill="#7a4a2a" />
      <circle cx="32" cy="172" r="54" fill="#4f9d5d" />
      <circle cx="82" cy="198" r="34" fill="#63ad6f" />
      <rect x="394" y="236" width="9" height="140" fill="#7a4a2a" />
      <circle cx="398" cy="226" r="40" fill="#4f9d5d" />
      <path d="M0 372 Q220 352 440 376 V560 H0Z" fill="#8a4b2b" />
      <circle cx="214" cy="230" r="21" fill="#2b2b3a" />
      <circle cx="214" cy="238" r="16" fill="#e9a47c" />
      <path d="M176 372 Q180 270 214 262 Q248 270 252 372Z" fill="#d85a40" />
      <rect x="262" y="318" width="42" height="40" rx="6" fill="#4a7fb5" />
      <path
        d="M232 300 L264 322"
        stroke="#e9a47c"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EventsPage() {
  const { t, lang } = useLang();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Track images that fail to load.
  const [failedImages, setFailedImages] = useState<Set<string>>(
    () => new Set()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return t("date_unavailable");
    }

    return date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetch upcoming events from backend.
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api("/events");

      const eventList = Array.isArray(response?.events)
        ? response.events
        : [];

      setEvents(eventList);
      setFailedImages(new Set());
    } catch (err) {
      console.error("EVENT FETCH ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  // Search filtering.
  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (q === "") return events;

    return events.filter((event) => {
      const fields = [
        event.title,
        event.description,
        event.location,
        event.eventType,
        event.creatorName,
      ];

      return fields.some((f) => String(f ?? "").toLowerCase().includes(q));
    });
  }, [events, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
  };

  // "All Events" button: reset the search and jump to the event list.
  const handleShowAll = () => {
    setSearchTerm("");

    requestAnimationFrame(() => {
      document
        .getElementById(RESULTS_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const hasActiveFilters = searchTerm.trim() !== "";

  const countText = t("evp_count")
    .replace("{shown}", String(filteredEvents.length))
    .replace("{total}", String(events.length));

  // Handle image loading errors.
  const handleImageError = (eventId: string, imageUrl: string) => {
    console.error("EVENT IMAGE FAILED:", {
      eventId,
      imageUrl,
    });

    setFailedImages((previous) => {
      const updated = new Set(previous);
      updated.add(eventId);
      return updated;
    });
  };

  return (
    <main className="ev-page">
      <div className="ev-wrap">
        {/* HERO */}
        <section className="ev-hero">
          <div className="ev-hero-left">
            <div className="ev-logo-row">
              <span className="ev-logo-icon">
                <Leaf size={20} />
              </span>

              <span className="ev-display ev-logo-text">
                rooted<span className="ev-logo-dot">.</span>
                <small>BD</small>
              </span>
            </div>

            <h1 className="ev-display ev-title">{t("evp_title")}</h1>
            <p className="ev-lead">{t("evp_lead")}</p>

            <ul className="ev-perks">
              <li>
                <CalendarDays size={16} />
                {t("evp_perk_1")}
              </li>

              <li>
                <Users size={16} />
                {t("evp_perk_2")}
              </li>
            </ul>

            <label className="ev-label" htmlFor="ev-search">
              {t("evp_search_label")}
            </label>

            <div className="ev-search">
              <Search size={18} className="ev-search-icon" />

              <input
                id="ev-search"
                type="text"
                className="ev-input"
                placeholder={t("evp_search_ph")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button
                  type="button"
                  className="ev-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label={t("evp_clear_search")}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <span className="ev-label">{t("evp_category")}</span>

            <div
              className="ev-chips"
              style={{ position: "relative", zIndex: 5 }}
            >
              {/* All Events */}
              <button
                type="button"
                className="ev-chip"
                aria-pressed={!hasActiveFilters}
                onClick={handleShowAll}
                style={{ cursor: "pointer" }}
              >
                {t("evp_all")}
              </button>

              {/* Saved Events (nav er Saved Events page er sathe connected) */}
              <Link
                href={SAVED_EVENTS_HREF}
                className="ev-chip"
                aria-pressed={false}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Bookmark size={14} />
                {lang === "bn" ? "সেভ করা ইভেন্ট" : "Saved Events"}
              </Link>
            </div>
          </div>

          <div className="ev-art">
            <Illustration />

            <div className="ev-inset">
              <span className="ev-pill">
                <Leaf size={12} />
                {t("community")}
              </span>

              <h2>{t("evp_card_title")}</h2>
              <p>{t("evp_card_text")}</p>

              <Link href={CREATE_EVENT_HREF} className="ev-amber">
                {t("host_event")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section id={RESULTS_ID} className="ev-results" aria-live="polite">
          <div className="ev-results-head">
            <div>
              <h2 className="ev-display ev-h2">
                {t("evp_section_title")}
              </h2>

              <p className="ev-sub">{t("evp_section_text")}</p>
            </div>

            <div className="ev-count">
              <span>{loading ? t("evp_loading") : countText}</span>

              {!loading && hasActiveFilters && (
                <button
                  type="button"
                  className="ev-link-btn"
                  onClick={clearFilters}
                >
                  {t("evp_clear_filters")}
                </button>
              )}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="ev-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="ev-skel" />
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error !== "" && (
            <div className="ev-empty">
              <span className="ev-empty-icon">
                <RefreshCw size={26} />
              </span>

              <h3>{t("evp_error_title")}</h3>
              <p>{error || t("evp_load_failed")}</p>

              <button
                type="button"
                className="ev-btn ev-btn-wide"
                onClick={() => void fetchEvents()}
              >
                <RefreshCw size={16} />
                {t("evp_try_again")}
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && error === "" && filteredEvents.length === 0 && (
            <div className="ev-empty">
              <span className="ev-empty-icon">
                {events.length === 0 ? (
                  <CalendarDays size={28} />
                ) : (
                  <Search size={28} />
                )}
              </span>

              <h3>
                {events.length === 0
                  ? t("evp_empty_title")
                  : t("evp_nomatch_title")}
              </h3>

              <p>
                {events.length === 0
                  ? t("evp_empty_text")
                  : t("evp_nomatch_text")}
              </p>

              {events.length === 0 ? (
                <Link href={CREATE_EVENT_HREF} className="ev-btn ev-btn-wide">
                  {t("evp_create")}
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <button
                  type="button"
                  className="ev-btn ev-btn-wide"
                  onClick={clearFilters}
                >
                  {t("evp_clear_filters")}
                </button>
              )}
            </div>
          )}

          {/* EVENT CARDS */}
          {!loading && error === "" && filteredEvents.length > 0 && (
            <div className="ev-grid">
              {filteredEvents.map((event, index) => {
                const imageUrl =
                  typeof event.thumbnail === "string"
                    ? event.thumbnail.trim()
                    : "";

                const showImage =
                  imageUrl !== "" && !failedImages.has(event._id);

                return (
                  <motion.article
                    key={event._id}
                    className="ev-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index, 8) * 0.05,
                    }}
                  >
                    <div className="ev-thumb" style={{ position: "relative" }}>
                      {showImage ? (
                        <img
                          src={imageUrl}
                          alt={event.title}
                          loading="lazy"
                          onError={() =>
                            handleImageError(event._id, imageUrl)
                          }
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <Sprout size={54} />
                      )}

                      {/* Save (bookmark) button */}
                      <SaveButton eventId={event._id} />
                    </div>

                    <div className="ev-card-body">
                      <span className="ev-pill">
                        {event.eventType || t("type_default")}
                      </span>

                      <h3>{event.title}</h3>

                      <p className="ev-desc">{event.description}</p>

                      <ul className="ev-meta">
                        <li>
                          <CalendarDays size={15} />
                          <span>{formatDate(event.eventDate)}</span>
                        </li>

                        <li>
                          <MapPin size={15} />
                          <span>{event.location}</span>
                        </li>
                      </ul>

                      <p className="ev-by">
                        {t("evp_organized_by")}
                        <strong>
                          {event.creatorName || t("evp_member")}
                        </strong>
                      </p>

                      <Link href={`/events/${event._id}`} className="ev-btn">
                        {t("view_event")}
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM CTA */}
        <section className="ev-cta">
          <div>
            <h2 className="ev-display">{t("evp_cta_title")}</h2>
            <p>{t("evp_cta_text")}</p>
          </div>

          <Link href={JOIN_HREF} className="ev-amber">
            {t("join_community")}
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}