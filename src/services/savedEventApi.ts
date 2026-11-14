import { api } from "@/lib/api";
import type { SavedEvent } from "@/types/saved-event";

// NEXT_PUBLIC_API_URL has no "/api" at the end, so the path starts with "/api"
const SAVED_PATH = "/api/saved-events";

// third argument "true" = attach the BetterAuth JWT token (login required)
export const getSavedEvents = async (): Promise<SavedEvent[]> => {
  const result = await api(SAVED_PATH, {}, true);
  return result.events;
};

export const getSavedIds = async (): Promise<string[]> => {
  const result = await api(`${SAVED_PATH}/ids`, {}, true);
  return result.ids;
};

export const saveEvent = (eventId: string) =>
  api(`${SAVED_PATH}/${eventId}`, { method: "POST" }, true);

export const removeSavedEvent = (eventId: string) =>
  api(`${SAVED_PATH}/${eventId}`, { method: "DELETE" }, true);