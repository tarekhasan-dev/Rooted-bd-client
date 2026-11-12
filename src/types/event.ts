export interface ScheduleItem {
  time: string;
  title: string;
  note: string;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName: string;
  creatorEmail: string;

  // Optional: older events do not have these
  capacity?: number;
  schedule?: ScheduleItem[];
  bringItems?: string[];
}

export interface EventDetail {
  event: EventItem;
  joinedCount: number;
  participantInitials: string[];
  organizerEventCount: number;
}