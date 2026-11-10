export interface UserLocation {
  division?: string;
  district?: string;
  upazila?: string;
  postalCode?: string;
}

export interface UserProfile {
  id: string;

  // Basic Information
  name: string;
  email: string;
  image?: string | null;
  role?: string;

  // Personal Information
  dateOfBirth?: string;
  gender?: string;
  bio?: string;

  // Contact Information
  phone?: string;

  // Location
  location?: UserLocation;

  // Interests
  interests?: string[];

  // Account Information
  emailVerified?: boolean;
  createdAt?: string;
  accountCreatedAt?: string | null;
}

export interface ProfileFormData {
  name: string;
  image?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  phone?: string;
  location?: UserLocation;
  interests?: string[];
}