
import { api } from "@/lib/api";

import type { EventDetail, EventItem } from "@/types/event";

// Must match the path where joinRoutes is mounted in server.js
const JOINS_PATH = "/joins";

// My Events API response type
export interface MyEventApiItem extends EventItem {
  status: "pending" | "published" | "draft";
  createdAt: string | number;
  updatedAt?: string | number;
}

// Create Event payload type
export interface CreateEventPayload {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  capacity: number;
  bringItems: string[];
  schedule?: {
    time: string;
    title: string;
    note?: string;
  }[];
  submissionType: "draft" | "publish";
}

// Get a single event + join count, participant initials, organizer count
export const getEventById = async (id: string): Promise<EventDetail> => {
  const result = await api(`/events/${id}`);

  return {
    event: result.event,
    joinedCount: Number(result.joinedCount ?? 0),
    participantInitials: Array.isArray(result.participantInitials)
      ? result.participantInitials.map((item: unknown) => String(item))
      : [],
    organizerEventCount: Number(result.organizerEventCount ?? 0),
  };
};

// Get all upcoming published events (Public)
export const getUpcomingEvents = async (): Promise<EventItem[]> => {
  const result = await api("/events");

  return Array.isArray(result.events) ? result.events : [];
};

// Get events created by the logged-in user (Protected)
export const getMyEvents = async (): Promise<MyEventApiItem[]> => {
  const result = await api("/events/my-events", {}, true);

  return Array.isArray(result.events) ? result.events : [];
};

// Create a new event (Protected)
export const createEvent = async (payload: CreateEventPayload) => {
  return api(
    "/events",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
};

// Delete an event created by the logged-in user (Protected)
export const deleteEvent = async (eventId: string) => {
  return api(
    `/events/${eventId}`,
    {
      method: "DELETE",
    },
    true
  );
};

// Get IDs of events the logged-in user has joined
export const getMyJoinedEventIds = async (): Promise<string[]> => {
  const result = await api(JOINS_PATH, {}, true);

  if (!Array.isArray(result.joinedEvents)) return [];

  return result.joinedEvents.map((item: { eventId: string }) =>
    String(item.eventId)
  );
};

// Join an event (Protected)
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

// Leave an event (Protected)
export const leaveEvent = async (eventId: string) => {
  return api(`${JOINS_PATH}/${eventId}`, { method: "DELETE" }, true);
};
