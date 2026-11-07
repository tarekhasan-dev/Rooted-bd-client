
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Search,
  Sprout,
  Users,
  RefreshCw,
  X,
} from "lucide-react";
import { motion } from "motion/react";

import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

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

const ALL_CATEGORIES = "All Events";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] =
    useState(ALL_CATEGORIES);

  // Fetch upcoming events from backend
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api("/events");

      setEvents(
        Array.isArray(response.events) ? response.events : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  // Generate categories dynamically from database
  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();

    events.forEach((event) => {
      const category = String(event.eventType ?? "").trim();

      if (!category) return;

      const normalizedCategory = category.toLowerCase();

      if (!categoryMap.has(normalizedCategory)) {
        categoryMap.set(normalizedCategory, category);
      }
    });

    const dynamicCategories = Array.from(
      categoryMap.values()
    ).sort((a, b) => a.localeCompare(b));

    return [ALL_CATEGORIES, ...dynamicCategories];
  }, [events]);

  // Reset category if it no longer exists
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(ALL_CATEGORIES);
    }
  }, [categories, activeCategory]);

  // Search and category filtering
  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const searchableFields = [
        event.title,
        event.description,
        event.location,
        event.eventType,
        event.creatorName,
      ];

      const matchesSearch =
        normalizedSearch === "" ||
        searchableFields.some((field) =>
          String(field ?? "")
            .toLowerCase()
            .includes(normalizedSearch)
        );

      const normalizedEventType = String(
        event.eventType ?? ""
      )
        .trim()
        .toLowerCase();

      const matchesCategory =
        activeCategory === ALL_CATEGORIES ||
        normalizedEventType === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, activeCategory]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory(ALL_CATEGORIES);
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    activeCategory !== ALL_CATEGORIES;

  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#18352b]">
      <Navbar />

      {/* HERO SECTION */}

      <section className="relative overflow-hidden bg-[#18352b] px-5 pb-20 pt-28 text-white md:px-10 md:pb-28 md:pt-36">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#d8e8b8]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#78945c]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#d8e8b8]">
              <Sprout size={15} />
              COMMUNITY STARTS HERE
            </span>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Find your purpose.
              <br />
              <span className="text-[#c8dc9c]">
                Make a difference.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
              Discover meaningful community events, meet
              people who share your values and turn small
              actions into positive change.
            </p>

            <div className="mt-9 flex flex-wrap gap-6 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <CalendarDays size={17} />
                Meaningful Activities
              </span>

              <span className="flex items-center gap-2">
                <Users size={17} />
                Stronger Communities
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EVENTS SECTION */}

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADING */}

          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#78945c]">
                <CalendarDays size={15} />
                EXPLORE OPPORTUNITIES
              </span>

              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Upcoming Events
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                Find an opportunity that inspires you.
                Every contribution makes a difference.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#18352b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315b47]"
            >
              Host an Event
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* SEARCH */}

          <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                placeholder="Search events, locations, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-[#78945c] focus:ring-2 focus:ring-[#78945c]/10"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#18352b]"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>
                {loading
                  ? "Loading events..."
                  : `${filteredEvents.length} of ${events.length} events`}
              </span>

              {!loading && hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-[#78945c] transition hover:text-[#18352b]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY FILTER */}

          <div className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.12em] text-gray-400">
                FILTER BY CATEGORY
              </span>

              <span className="text-xs text-gray-400">
                {categories.length - 1} categories available
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-[#18352b] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#78945c] hover:text-[#18352b]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING SKELETON */}

          {loading && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="h-56 animate-pulse bg-gray-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <RefreshCw size={27} />
              </div>

              <h3 className="text-xl font-semibold">
                Something went wrong
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void fetchEvents()}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#18352b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315b47]"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf2e5] text-[#78945c]">
                {events.length === 0 ? (
                  <CalendarDays size={34} />
                ) : (
                  <Search size={34} />
                )}
              </div>

              <h3 className="text-2xl font-semibold">
                {events.length === 0
                  ? "No upcoming events yet."
                  : "No matching events found."}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                {events.length === 0
                  ? "Be the first to bring your community together. Create an event and inspire positive change."
                  : "Try another search term or choose a different category to discover available events."}
              </p>

              {events.length === 0 ? (
                <Link
                  href="/create-event"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#18352b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315b47]"
                >
                  Create an Event
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-7 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold transition hover:bg-gray-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* EVENT CARDS */}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <motion.article
                  key={event._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* EVENT IMAGE */}

                  <div className="relative h-56 overflow-hidden bg-[#e8eddf]">
                    {event.thumbnail ? (
                      <div
                        role="img"
                        aria-label={event.title}
                        className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url("${event.thumbnail}")`,
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#78945c]">
                        <Sprout size={55} />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#315b47] shadow-sm">
                      {event.eventType || "Community"}
                    </span>
                  </div>

                  {/* EVENT INFORMATION */}

                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[#78945c]">
                      <CalendarDays size={15} />
                      {formatDate(event.eventDate)}
                    </div>

                    <h3 className="line-clamp-2 text-xl font-semibold leading-snug transition group-hover:text-[#78945c]">
                      {event.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-gray-500">
                      {event.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={16}
                        className="shrink-0 text-[#78945c]"
                      />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                      <div className="min-w-0">
                        <span className="text-xs text-gray-400">
                          Organized by
                        </span>

                        <p className="truncate text-sm font-semibold text-[#315b47]">
                          {event.creatorName || "Community Member"}
                        </p>
                      </div>

                      <Link
                        href={`/events/${event._id}`}
                        aria-label={`View details for ${event.title}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf2e5] text-[#315b47] transition hover:bg-[#18352b] hover:text-white"
                      >
                        <ArrowUpRight size={20} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM CTA */}

      <section className="bg-[#edf2e5] px-5 py-16 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.18em] text-[#78945c]">
              BE PART OF SOMETHING GOOD
            </span>

            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Your community needs you.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600">
              Share an idea, organize an activity and bring
              people together for a better Bangladesh.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#18352b] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#315b47]"
          >
            Join the Community
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
