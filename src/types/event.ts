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
}

export interface EventDetail {
  event: EventItem;
  joinedCount: number;
}