
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Plus,
  RefreshCw,
  Sprout,
  CalendarCheck,
  History,
  Search,
} from "lucide-react";
import { motion } from "motion/react";

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
  createdAt: string;
}

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

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api("/events/my-events", {}, true);

      setEvents(
        Array.isArray(response.events) ? response.events : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMyEvents();
  }, [fetchMyEvents]);

  const upcomingEvents = useMemo(
    () =>
      events.filter(
        (event) => new Date(event.eventDate).getTime() >= Date.now()
      ).length,
    [events]
  );

  const pastEvents = events.length - upcomingEvents;

  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return events;

    return events.filter((event) =>
      [
        event.title,
        event.description,
        event.eventType,
        event.location,
      ].some((field) =>
        String(field ?? "").toLowerCase().includes(search)
      )
    );
  }, [events, searchTerm]);

  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#18352b]">
      {/* HERO SECTION */}

      <section className="relative overflow-hidden bg-[#18352b] px-5 pb-20 pt-28 text-white md:px-10 md:pb-24 md:pt-36">
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
              YOUR COMMUNITY JOURNEY
            </span>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Your Events.
              <br />
              <span className="text-[#c8dc9c]">
                Your Impact.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
              Every event begins with an idea. Manage your
              initiatives, track your activities and keep
              creating meaningful change in your community.
            </p>

            <Link
              href="/create-event"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#c8dc9c] px-7 py-3.5 text-sm font-semibold text-[#18352b] transition hover:bg-white"
            >
              <Plus size={18} />
              Create New Event
              <ArrowUpRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADING */}

          <div className="mb-10">
            <span className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#78945c]">
              <CalendarDays size={15} />
              EVENT MANAGEMENT
            </span>

            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Manage Your Events
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
              Keep track of the events you have created and
              the positive changes you are bringing to life.
            </p>
          </div>

          {/* STATISTICS */}

          <div className="mb-12 grid gap-5 sm:grid-cols-3">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Total Events
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2e5] text-[#78945c]">
                  <CalendarDays size={21} />
                </div>
              </div>

              <h3 className="mt-5 text-4xl font-semibold tabular-nums">
                {loading ? "—" : events.length}
              </h3>

              <p className="mt-2 text-xs text-gray-400">
                Events created by you
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Upcoming Events
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarCheck size={21} />
                </div>
              </div>

              <h3 className="mt-5 text-4xl font-semibold tabular-nums">
                {loading ? "—" : upcomingEvents}
              </h3>

              <p className="mt-2 text-xs text-gray-400">
                Events yet to happen
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Past Events
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <History size={21} />
                </div>
              </div>

              <h3 className="mt-5 text-4xl font-semibold tabular-nums">
                {loading ? "—" : pastEvents}
              </h3>

              <p className="mt-2 text-xs text-gray-400">
                Events already completed
              </p>
            </motion.div>
          </div>

          {/* EVENT LIST HEADING */}

          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">
                Your Created Events
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {loading
                  ? "Loading your events..."
                  : `${filteredEvents.length} of ${events.length} events`}
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#18352b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315b47]"
            >
              <Plus size={17} />
              Host an Event
            </Link>
          </div>

          {/* SEARCH */}

          <div className="relative mb-10 w-full md:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              placeholder="Search your events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#78945c] focus:ring-2 focus:ring-[#78945c]/10"
            />
          </div>

          {/* LOADING STATE */}

          {loading && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
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
                onClick={() => void fetchMyEvents()}
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
                  ? "Your journey starts here."
                  : "No matching events found."}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                {events.length === 0
                  ? "You haven't created any events yet. Start an initiative and bring your community together."
                  : "Try another search term to find your events."}
              </p>

              {events.length === 0 ? (
                <Link
                  href="/create-event"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#18352b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315b47]"
                >
                  Create Your First Event
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-7 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold transition hover:bg-gray-100"
                >
                  Clear Search
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

                    <span className="absolute right-4 top-4 rounded-full bg-[#18352b]/90 px-3 py-2 text-xs font-semibold text-white">
                      {new Date(event.eventDate).getTime() >= Date.now()
                        ? "Upcoming"
                        : "Completed"}
                    </span>
                  </div>

                  {/* EVENT INFORMATION */}

                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[#78945c]">
                      <CalendarDays size={15} />
                      {formatDate(event.eventDate)}
                    </div>

                    <h4 className="line-clamp-2 text-xl font-semibold leading-snug transition group-hover:text-[#78945c]">
                      {event.title}
                    </h4>

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
                          Created on
                        </span>

                        <p className="truncate text-sm font-semibold text-[#315b47]">
                          {formatDate(event.createdAt)}
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
              KEEP MAKING A DIFFERENCE
            </span>

            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Every action matters.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600">
              Your next initiative could inspire an entire
              community. Keep building something meaningful.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#18352b] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#315b47]"
          >
            Explore Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
