
import { api } from "@/lib/api";

import type {
  UserProfile,
  ProfileFormData,
} from "@/types/profile";

// Get logged-in user's profile
export const getMyProfile = async (): Promise<UserProfile> => {
  const result = await api("/profile/me", {}, true);

  return result.profile;
};

// Update logged-in user's profile
export const updateMyProfile = async (
  profileData: ProfileFormData
) => {
  const result = await api(
    "/profile/me",
    {
      method: "PUT",
      body: JSON.stringify(profileData),
    },
    true
  );

  return result;
};

// Upload profile image or cover photo
export const uploadProfileImage = async (
  file: File,
  imageType: "profile" | "cover"
) => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("imageType", imageType);

  const result = await api(
    "/upload/image",
    {
      method: "POST",
      body: formData,
    },
    true
  );

  return result;
};
