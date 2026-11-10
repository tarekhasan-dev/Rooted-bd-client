import { createAuthClient } from "better-auth/react";
import {
adminClient,
jwtClient,
} from "better-auth/client/plugins";

import {
ac,
admin,
organizer,
user,
} from "@/lib/permissions";

export const authClient = createAuthClient({
baseURL:
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000",

plugins: [
  adminClient({
    ac,
    roles: {
      admin,
      organizer,
      user,
    },
  }),

  jwtClient(),
],
});
