export type MyEventStatus = "pending" | "published" | "draft";

export type MyEvent = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  joined: number;
  feeType: "free" | "paid";
  feeAmount: number;
  items: string[];
  status: MyEventStatus;
  createdAt: number;
};

const KEY = "rooted-my-events";

export function readMyEvents(): MyEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as MyEvent[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: MyEvent[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked */
  }
}

export function saveMyEvent(event: MyEvent) {
  const list = readMyEvents().filter((item) => item.id !== event.id);
  write([event, ...list]);
}

export function deleteMyEvent(id: string) {
  write(readMyEvents().filter((item) => item.id !== id));
}