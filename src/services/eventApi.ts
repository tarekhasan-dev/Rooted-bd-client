import { api } from "@/lib/api";

import type { EventDetail, EventItem } from "@/types/event";

// Must match the path where joinRoutes is mounted in server.js
const JOINS_PATH = "/joins";

// Get a single event + how many people joined (Public)
export const getEventById = async (id: string): Promise<EventDetail> => {
  const result = await api(`/events/${id}`);

  return {
    event: result.event,
    joinedCount: Number(result.joinedCount ?? 0),
  };
};

// Get all upcoming events (Public)
export const getUpcomingEvents = async (): Promise<EventItem[]> => {
  const result = await api("/events");

  return Array.isArray(result.events) ? result.events : [];
};

// IDs of events the logged-in user has joined
export const getMyJoinedEventIds = async (): Promise<string[]> => {
  const result = await api(JOINS_PATH, {}, true);

  if (!Array.isArray(result.joinedEvents)) return [];

  return result.joinedEvents.map((item: { eventId: string }) =>
    String(item.eventId)
  );
};

// Join an event
export const joinEvent = async (eventId: string) => {
  return api(
    JOINS_PATH,
    {
      method: "POST",
      body: JSON.stringify({ eventId }),
    },
    true
  );
};

// Leave an event
export const leaveEvent = async (eventId: string) => {
  return api(`${JOINS_PATH}/${eventId}`, { method: "DELETE" }, true);
};