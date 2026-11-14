export interface SavedEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string; // ISO string
  registrationDeadline?: string | null; // ISO string
  image?: string | null;
  savedAt: string; // ISO string
}